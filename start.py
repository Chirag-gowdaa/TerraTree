import os
import sys
import subprocess
import webbrowser
import time

def print_banner():
    print("""
========================================================================
   _________  _______  ____  ___  ________  _______  ______
  /_  __/ _ \/ __/ _ \/ __ \/ _ \/ __/ __/ / __/ _ \/ __/ /
   / / /  __/ _// , _/ /_/ / , _/ _// _/  / _// // / _// /_ 
  /_/  \___/___/_/|_|\____/_/|_/___/___/  /___/____/___/___/ 
                                                               
      TERRATREE — AI-Powered Forest Intelligence (Production Demo)
========================================================================
    """)

def main():
    print_banner()

    root_dir = os.path.dirname(os.path.abspath(__file__))
    dist_dir = os.path.join(root_dir, "frontend", "dist")

    dev_mode = "--dev" in sys.argv

    if dev_mode:
        print("[TerraTree] Starting in DEVELOPMENT mode...")
        print("[TerraTree] Launching FastAPI backend on http://127.0.0.1:8000 ...")
        backend_proc = subprocess.Popen(
            [sys.executable, "-m", "uvicorn", "src.api.main:app", "--host", "127.0.0.1", "--port", "8000", "--reload"],
            cwd=root_dir
        )
        print("[TerraTree] Launching Vite frontend on http://localhost:5173 ...")
        frontend_proc = subprocess.Popen(
            ["npx.cmd" if sys.platform == "win32" else "npx", "vite"],
            cwd=os.path.join(root_dir, "frontend")
        )
        time.sleep(2)
        webbrowser.open("http://localhost:5173")
        try:
            backend_proc.wait()
            frontend_proc.wait()
        except KeyboardInterrupt:
            print("\n[TerraTree] Shutting down development servers...")
            backend_proc.terminate()
            frontend_proc.terminate()
        return

    # Production single-port mode
    if not os.path.exists(dist_dir):
        print("[TerraTree] Frontend production build not found. Building now...")
        env = os.environ.copy()
        env["NODE_OPTIONS"] = "--dns-result-order=ipv4first"
        res = subprocess.run(
            ["npm.cmd" if sys.platform == "win32" else "npm", "run", "build"],
            cwd=os.path.join(root_dir, "frontend"),
            env=env
        )
        if res.returncode != 0:
            print("[TerraTree] Build failed. Please check error output.")
            sys.exit(1)

    print("\n[TerraTree] System online.")
    print("[TerraTree] Running application on: http://localhost:8000")
    print("[TerraTree] Interactive API docs:   http://localhost:8000/docs")
    print("\nPress Ctrl+C to terminate the server.\n")

    # Open browser after a brief delay
    def open_browser():
        time.sleep(1.2)
        webbrowser.open("http://localhost:8000")

    import threading
    threading.Thread(target=open_browser, daemon=True).start()

    import uvicorn
    uvicorn.run("src.api.main:app", host="127.0.0.1", port=8000, reload=False)

if __name__ == "__main__":
    main()
