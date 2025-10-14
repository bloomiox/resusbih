from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()
    page.goto("http://localhost:5173")

    # Navigate to Admin page
    page.goto("http://localhost:5173/#Admin")


    # Fill out the form
    page.wait_for_selector('input[id="title"]')
    page.fill('input[id="title"]', "Test Title")
    page.wait_for_selector('textarea[id="shortDescription"]')
    page.fill('textarea[id="shortDescription"]', "Test Short Description")
    page.wait_for_selector('textarea[id="fullContent"]')
    page.fill('textarea[id="fullContent"]', "Test Full Content")

    # Take a screenshot
    page.screenshot(path="jules-scratch/verification/admin_page.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)