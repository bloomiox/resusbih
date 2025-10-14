from playwright.sync_api import sync_playwright

from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:5175")
        page.wait_for_timeout(5000) # Wait for 5 seconds

        # Navigate to the News page
        page.get_by_role("link", name="Novosti").click()
        page.wait_for_selector("text=Sortiraj po:")

        # Default sort (newest first)
        page.screenshot(path="jules-scratch/verification/newest_first.png")

        # Click to sort by oldest
        page.get_by_role("button", name="Najstarije").click()
        page.wait_for_timeout(1000) # Wait for re-render
        page.screenshot(path="jules-scratch/verification/oldest_first.png")

        browser.close()

if __name__ == "__main__":
    run()