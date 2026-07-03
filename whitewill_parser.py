import os
import time
from playwright.sync_api import sync_playwright

PHONE = "+7 922 913 9199"
NAME = "Лидия"
EMAIL = "fartygina.lidia20@gmail.com"
DOWNLOAD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "downloads")


def run():
    os.makedirs(DOWNLOAD_DIR, exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, slow_mo=300)
        context = browser.new_context(accept_downloads=True, locale="ru-RU")
        page = context.new_page()

        print("Открываю whitewill.ru...")
        page.goto("https://whitewill.ru", timeout=60000)
        page.wait_for_load_state("domcontentloaded", timeout=30000)
        time.sleep(3)

        # Шаг 1: нажать "СКАЧАТЬ КАТАЛОГ" на главной странице
        print("Нажимаю 'СКАЧАТЬ КАТАЛОГ'...")
        page.locator("button:has-text('СКАЧАТЬ КАТАЛОГ')").first.click()
        page.wait_for_selector(".popup_catalog .popup__list-btn", timeout=10000)
        time.sleep(1)

        # Шаг 2: выбрать "Новостройки Москвы" (первая кнопка в списке)
        print("Выбираю 'Новостройки Москвы'...")
        page.locator(".popup_catalog .popup__list-btn .btn").first.click()
        page.wait_for_selector("[data-testid='form_author_catalogs.phone_input']", timeout=10000)
        time.sleep(1)

        # Шаг 3: заполнить форму
        print("Заполняю форму...")
        phone_input = page.locator("[data-testid='form_author_catalogs.phone_input']")
        phone_input.fill(PHONE)

        name_input = page.locator("[data-testid='form_author_catalogs.name_input']")
        name_input.fill(NAME)

        email_input = page.locator("[data-testid='form_author_catalogs.email_input']")
        email_input.fill(EMAIL)

        time.sleep(0.5)
        print(f"  Телефон: {phone_input.input_value()}")
        print(f"  Имя:     {name_input.input_value()}")
        print(f"  Email:   {email_input.input_value()}")

        # Шаг 4: нажать "Скачать каталог" и перехватить скачивание
        print("Нажимаю 'Скачать каталог'...")
        submit_btn = page.locator("[data-testid='form_author_catalogs.submit_button']")

        try:
            with page.expect_download(timeout=30000) as dl:
                submit_btn.click()
            download = dl.value
            filename = download.suggested_filename or "catalog_novostrojki_moskvy.pdf"
            save_path = os.path.join(DOWNLOAD_DIR, filename)
            download.save_as(save_path)
            print(f"\nКаталог сохранён: {save_path}")
        except Exception as e:
            # Иногда сайт показывает благодарность и PDF открывается в новой вкладке
            print(f"Ожидание download завершилось: {e}")
            print("Проверяю ответ страницы...")
            time.sleep(3)
            thanks = page.locator(".popup__thanks").first
            if thanks.is_visible():
                print("Форма отправлена успешно — появилось сообщение благодарности.")
                print("PDF может быть отправлен на почту или открыться в новой вкладке.")
            else:
                print("Статус отправки неизвестен — проверьте браузер.")

        time.sleep(3)
        browser.close()


if __name__ == "__main__":
    run()
