import asyncio
import json
import os
import subprocess
import tempfile
import time
import base64
import requests
import websockets

async def main():
    chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    user_data = os.path.join(tempfile.gettempdir(), 'chrome_cdp_profile_screenshots')
    screenshot_dir = os.path.join(os.getcwd(), 'assets', 'screenshots')
    os.makedirs(screenshot_dir, exist_ok=True)
    
    proc = subprocess.Popen([
        chrome_path,
        '--headless=new',
        '--no-sandbox',
        '--disable-gpu',
        '--disable-extensions',
        '--force-device-scale-factor=1.5',
        f'--user-data-dir={user_data}',
        '--remote-debugging-port=9222',
        'about:blank'
    ])
    
    try:
        pages = None
        for _ in range(30):
            try:
                res = requests.get('http://127.0.0.1:9222/json/list', timeout=1)
                pages = res.json()
                if pages:
                    break
            except Exception:
                time.sleep(0.3)
        
        target = next((p for p in pages if p.get('type') == 'page'), None)
        if not target:
            print("No browser page available!", flush=True)
            return

        ws_url = target['webSocketDebuggerUrl']
        print(f"Connected to CDP session at: {ws_url}", flush=True)
        
        async with websockets.connect(ws_url, max_size=35*1024*1024) as ws:
            msg_id = 1
            
            async def send_cmd(method, params=None):
                nonlocal msg_id
                cid = msg_id
                msg_id += 1
                payload = {"id": cid, "method": method, "params": params or {}}
                await ws.send(json.dumps(payload))
                while True:
                    resp = json.loads(await ws.recv())
                    if resp.get('id') == cid:
                        return resp.get('result', {})

            await send_cmd("Page.enable")
            await send_cmd("Runtime.enable")
            
            async def set_desktop_viewport():
                await send_cmd("Emulation.setDeviceMetricsOverride", {
                    "width": 1440,
                    "height": 920,
                    "deviceScaleFactor": 1.5,
                    "mobile": False
                })

            async def set_mobile_viewport():
                await send_cmd("Emulation.setDeviceMetricsOverride", {
                    "width": 390,
                    "height": 844,
                    "deviceScaleFactor": 2.5,
                    "mobile": True
                })

            async def capture_to(filename):
                res = await send_cmd("Page.captureScreenshot", {"format": "png"})
                img_bytes = base64.b64decode(res['data'])
                file_path = os.path.join(screenshot_dir, filename)
                with open(file_path, 'wb') as f:
                    f.write(img_bytes)
                print(f"[OK] Saved {filename} ({len(img_bytes)} bytes)", flush=True)
                return file_path

            await set_desktop_viewport()
            
            # Navigate to site
            print("Navigating to http://localhost:3000...", flush=True)
            await send_cmd("Page.navigate", {"url": "http://localhost:3000"})
            await asyncio.sleep(3)
            
            # 1. Force light mode & establish authorized reader session
            print("Configuring light mode and reader credentials in localStorage...", flush=True)
            await send_cmd("Runtime.evaluate", {
                "expression": """
                    localStorage.setItem('trace_theme', 'light');
                    localStorage.setItem('truthlens_theme', 'light');
                    localStorage.setItem('trace_user_role', 'reader');
                    localStorage.setItem('trace_user_session', JSON.stringify({
                        uid: 'reader-user-1',
                        email: 'reader@trace.news',
                        displayName: 'TRACE Reader Desk',
                        photoURL: null,
                        role: 'reader',
                        roleTitle: 'Public Reader'
                    }));
                    document.documentElement.classList.remove('dark');
                    document.body.classList.remove('dark');
                """
            })
            await asyncio.sleep(1)

            # 2. Capture Home Page (Desktop Hero & Broadsheet Masthead)
            print("Capturing home.png...", flush=True)
            await send_cmd("Runtime.evaluate", {"expression": "window.scrollTo(0, 0);"})
            await asyncio.sleep(0.5)
            await capture_to("home.png")

            # 3. Capture Top Verified News
            print("Capturing top-news.png...", flush=True)
            await send_cmd("Runtime.evaluate", {
                "expression": """
                    const section = document.getElementById('main-content-section');
                    if (section) section.scrollIntoView({ behavior: 'instant', block: 'start' });
                """
            })
            await asyncio.sleep(0.8)
            await capture_to("top-news.png")

            # 4. Capture Live News Wire Tab (GNews v4 Integration)
            print("Capturing live-news.png...", flush=True)
            await send_cmd("Runtime.evaluate", {
                "expression": """
                    const buttons = Array.from(document.querySelectorAll('button'));
                    const liveWireBtn = buttons.find(b => b.textContent && b.textContent.includes('Live News Wire'));
                    if (liveWireBtn) liveWireBtn.click();
                """
            })
            await asyncio.sleep(1.5)
            await send_cmd("Runtime.evaluate", {
                "expression": """
                    const section = document.getElementById('main-content-section');
                    if (section) section.scrollIntoView({ behavior: 'instant', block: 'start' });
                """
            })
            await asyncio.sleep(0.8)
            await capture_to("live-news.png")

            # 5. Capture Photo & Broadcast Media Verifier Tab
            print("Capturing news-media-verifier.png...", flush=True)
            await send_cmd("Runtime.evaluate", {
                "expression": """
                    const buttons = Array.from(document.querySelectorAll('button'));
                    const btn = buttons.find(b => b.textContent && b.textContent.includes('Photo & Broadcast Desk'));
                    if (btn) btn.click();
                """
            })
            await asyncio.sleep(1.2)
            await send_cmd("Runtime.evaluate", {
                "expression": """
                    const section = document.getElementById('main-content-section');
                    if (section) section.scrollIntoView({ behavior: 'instant', block: 'start' });
                """
            })
            await asyncio.sleep(0.8)
            await capture_to("news-media-verifier.png")

            # 6. Capture Deepfake Detection Suite Tab
            print("Capturing deepfake-detector.png...", flush=True)
            await send_cmd("Runtime.evaluate", {
                "expression": """
                    const buttons = Array.from(document.querySelectorAll('button'));
                    const btn = buttons.find(b => b.textContent && b.textContent.includes('Deepfake Lab'));
                    if (btn) btn.click();
                """
            })
            await asyncio.sleep(1.2)
            await send_cmd("Runtime.evaluate", {
                "expression": """
                    const section = document.getElementById('main-content-section');
                    if (section) section.scrollIntoView({ behavior: 'instant', block: 'start' });
                """
            })
            await asyncio.sleep(0.8)
            await capture_to("deepfake-detector.png")

            # 7. Capture AI Text Analyzer Tab
            print("Capturing ai-text-analyzer.png...", flush=True)
            await send_cmd("Runtime.evaluate", {
                "expression": """
                    const buttons = Array.from(document.querySelectorAll('button'));
                    const btn = buttons.find(b => b.textContent && b.textContent.includes('Writing & NLP Audit'));
                    if (btn) btn.click();
                """
            })
            await asyncio.sleep(1.2)
            await send_cmd("Runtime.evaluate", {
                "expression": """
                    const section = document.getElementById('main-content-section');
                    if (section) section.scrollIntoView({ behavior: 'instant', block: 'start' });
                """
            })
            await asyncio.sleep(0.8)
            await capture_to("ai-text-analyzer.png")

            # 8. Capture Dashboard & Analytics Tab
            print("Capturing dashboard.png...", flush=True)
            await send_cmd("Runtime.evaluate", {
                "expression": """
                    const buttons = Array.from(document.querySelectorAll('button'));
                    const btn = buttons.find(b => b.textContent && b.textContent.includes('Fact-Check Desk & Stats'));
                    if (btn) btn.click();
                """
            })
            await asyncio.sleep(1.2)
            await send_cmd("Runtime.evaluate", {
                "expression": """
                    const section = document.getElementById('main-content-section');
                    if (section) section.scrollIntoView({ behavior: 'instant', block: 'start' });
                """
            })
            await asyncio.sleep(0.8)
            await capture_to("dashboard.png")

            # 9. Capture Fact Check Audit Certificate Modal
            print("Capturing audit-certificate.png...", flush=True)
            # Switch back to Front Page and click the first verified news article
            await send_cmd("Runtime.evaluate", {
                "expression": """
                    const buttons = Array.from(document.querySelectorAll('button'));
                    const frontBtn = buttons.find(b => b.textContent && b.textContent.includes('Front Page'));
                    if (frontBtn) frontBtn.click();
                """
            })
            await asyncio.sleep(1.2)
            await send_cmd("Runtime.evaluate", {
                "expression": """
                    const firstArticle = document.querySelector('article');
                    if (firstArticle) firstArticle.click();
                """
            })
            await asyncio.sleep(1.5)
            await capture_to("audit-certificate.png")

            # Close modal if open
            await send_cmd("Runtime.evaluate", {
                "expression": """
                    const closeBtn = document.querySelector('button[title=\"Close\"]') || document.querySelector('button[aria-label=\"Close\"]');
                    if (closeBtn) closeBtn.click();
                """
            })
            await asyncio.sleep(0.5)

            # 10. Capture Mobile View
            print("Capturing mobile.png...", flush=True)
            await set_mobile_viewport()
            await send_cmd("Runtime.evaluate", {"expression": "window.scrollTo(0, 0);"})
            await asyncio.sleep(1.5)
            await capture_to("mobile.png")

            print("\n[COMPLETE] All 9 lightmode screenshots successfully captured and updated!", flush=True)
            
    finally:
        proc.terminate()
        try:
            proc.wait(timeout=2)
        except Exception:
            proc.kill()

if __name__ == '__main__':
    asyncio.run(main())
