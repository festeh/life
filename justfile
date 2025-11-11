# Justfile for running backend and frontend with automatic port management
# Supports multiple git worktrees with isolated port configurations

# Default ports for main worktree
DEFAULT_BACKEND_PORT := "8080"
DEFAULT_FRONTEND_PORT := "5173"

# Port range for random assignment in non-main worktrees
RANDOM_PORT_MIN := "8000"
RANDOM_PORT_MAX := "9999"

# Check if running in main worktree
_is_main_worktree:
    #!/usr/bin/env bash
    set -euo pipefail
    git_common_dir=$(git rev-parse --git-common-dir)
    git_dir=$(git rev-parse --git-dir)
    if [ "$git_common_dir" = "$git_dir" ]; then
        echo "true"
    else
        echo "false"
    fi

# Get backend port (from .env.local if exists, or determine based on worktree)
_get_backend_port:
    #!/usr/bin/env bash
    set -euo pipefail
    if [ -f backend/.env.local ] && grep -q "^PORT=" backend/.env.local; then
        grep "^PORT=" backend/.env.local | cut -d= -f2
    else
        is_main=$(just _is_main_worktree)
        if [ "$is_main" = "true" ]; then
            echo "{{DEFAULT_BACKEND_PORT}}"
        else
            echo $(({{RANDOM_PORT_MIN}} + RANDOM % ({{RANDOM_PORT_MAX}} - {{RANDOM_PORT_MIN}})))
        fi
    fi

# Get frontend port (from .env.local if exists, or determine based on worktree)
_get_frontend_port:
    #!/usr/bin/env bash
    set -euo pipefail
    if [ -f frontend/.env.local ] && grep -q "^VITE_DEV_PORT=" frontend/.env.local; then
        grep "^VITE_DEV_PORT=" frontend/.env.local | cut -d= -f2
    else
        is_main=$(just _is_main_worktree)
        if [ "$is_main" = "true" ]; then
            echo "{{DEFAULT_FRONTEND_PORT}}"
        else
            echo $(({{RANDOM_PORT_MIN}} + RANDOM % ({{RANDOM_PORT_MAX}} - {{RANDOM_PORT_MIN}})))
        fi
    fi

# Setup .env.local files with port configuration
_setup_env_files backend_port frontend_port:
    #!/usr/bin/env bash
    set -euo pipefail

    # Setup backend/.env.local
    echo "PORT={{backend_port}}" > backend/.env.local
    echo "FRONTEND_URL=http://localhost:{{frontend_port}}" >> backend/.env.local
    echo "Created backend/.env.local with PORT={{backend_port}}"

    # Setup frontend/.env.local
    echo "VITE_API_BASE_URL=http://localhost:{{backend_port}}" > frontend/.env.local
    echo "VITE_DEV_PORT={{frontend_port}}" >> frontend/.env.local
    echo "Created frontend/.env.local with VITE_API_BASE_URL=http://localhost:{{backend_port}}"

# Display current port configuration
ports:
    #!/usr/bin/env bash
    set -euo pipefail
    is_main=$(just _is_main_worktree)
    echo "Worktree type: $([ "$is_main" = "true" ] && echo "MAIN" || echo "LINKED")"
    echo ""

    if [ -f backend/.env.local ]; then
        echo "Backend configuration (backend/.env.local):"
        cat backend/.env.local | sed 's/^/  /'
    else
        echo "Backend configuration: Not configured (will use defaults)"
    fi
    echo ""

    if [ -f frontend/.env.local ]; then
        echo "Frontend configuration (frontend/.env.local):"
        cat frontend/.env.local | sed 's/^/  /'
    else
        echo "Frontend configuration: Not configured (will use defaults)"
    fi

# Remove .env.local files to reset port configuration
clean-ports:
    #!/usr/bin/env bash
    set -euo pipefail
    removed=0
    if [ -f backend/.env.local ]; then
        rm backend/.env.local
        echo "Removed backend/.env.local"
        removed=1
    fi
    if [ -f frontend/.env.local ]; then
        rm frontend/.env.local
        echo "Removed frontend/.env.local"
        removed=1
    fi
    if [ $removed -eq 0 ]; then
        echo "No .env.local files found"
    else
        echo "Port configuration reset. Run 'just run-dev' to generate new ports."
    fi

# Run backend on specified or auto-detected port
backend port="":
    #!/usr/bin/env bash
    set -euo pipefail

    if [ -n "{{port}}" ]; then
        backend_port="{{port}}"
        frontend_port=$(just _get_frontend_port)
        just _setup_env_files "$backend_port" "$frontend_port"
    else
        if [ ! -f backend/.env.local ]; then
            backend_port=$(just _get_backend_port)
            frontend_port=$(just _get_frontend_port)
            just _setup_env_files "$backend_port" "$frontend_port"
        else
            backend_port=$(grep "^PORT=" backend/.env.local | cut -d= -f2)
        fi
    fi

    echo "Starting backend on port $backend_port..."
    cd backend && go run cmd/server/main.go

# Run frontend on specified or auto-detected port
frontend port="":
    #!/usr/bin/env bash
    set -euo pipefail

    if [ -n "{{port}}" ]; then
        frontend_port="{{port}}"
        backend_port=$(just _get_backend_port)
        just _setup_env_files "$backend_port" "$frontend_port"
    else
        if [ ! -f frontend/.env.local ]; then
            backend_port=$(just _get_backend_port)
            frontend_port=$(just _get_frontend_port)
            just _setup_env_files "$backend_port" "$frontend_port"
        else
            frontend_port=$(grep "^VITE_DEV_PORT=" frontend/.env.local | cut -d= -f2)
        fi
    fi

    echo "Starting frontend on port $frontend_port..."
    cd frontend && npm run dev -- --port "$frontend_port"

# Run both backend and frontend with automatic port management
run-dev:
    #!/usr/bin/env bash
    set -euo pipefail

    is_main=$(just _is_main_worktree)

    # Determine ports
    if [ -f backend/.env.local ] && [ -f frontend/.env.local ]; then
        backend_port=$(grep "^PORT=" backend/.env.local | cut -d= -f2)
        frontend_port=$(grep "^VITE_DEV_PORT=" frontend/.env.local | cut -d= -f2)
        echo "Using existing port configuration..."
    else
        backend_port=$(just _get_backend_port)
        frontend_port=$(just _get_frontend_port)
        just _setup_env_files "$backend_port" "$frontend_port"

        if [ "$is_main" = "true" ]; then
            echo "Main worktree detected - using default ports"
        else
            echo "Linked worktree detected - generated random ports (persisted in .env.local)"
        fi
    fi

    echo ""
    echo "Port configuration:"
    echo "  Backend:  http://localhost:$backend_port"
    echo "  Frontend: http://localhost:$frontend_port"
    echo ""
    echo "Starting services..."
    echo "  Tip: Use 'just clean-ports' to reset and regenerate ports"
    echo "  Tip: Use 'just ports' to view current configuration"
    echo ""

    # Start backend in background
    echo "Starting backend..."
    cd backend && go run cmd/server/main.go &
    BACKEND_PID=$!

    # Wait a moment for backend to start
    sleep 2

    # Start frontend in background
    echo "Starting frontend..."
    cd frontend && npm run dev -- --port "$frontend_port" &
    FRONTEND_PID=$!

    echo ""
    echo "Services started!"
    echo "  Backend PID: $BACKEND_PID"
    echo "  Frontend PID: $FRONTEND_PID"
    echo ""
    echo "Press Ctrl+C to stop all services"

    # Wait for both processes
    wait $BACKEND_PID $FRONTEND_PID

# Default recipe - show available commands
default:
    @just --list
