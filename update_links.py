import re
import os

files = ['index.html', 'programs.html', 'about.html', 'contacts.html']
for f in files:
    with open(f, 'r') as file:
        content = file.read()
    
    # Update Header Nav
    old_nav = """            <nav class="nav">
                <a href="#programs">Программы обучения</a>
                <a href="#cases">Кейсы</a>
                <a href="blog.html">Блог</a>
                <a href="#contacts">Контакты</a>
                <a href="#enroll" class="btn btn-primary btn-sm">Записаться на обучение</a>
            </nav>"""
    new_nav = """            <nav class="nav">
                <a href="programs.html">Программы обучения</a>
                <a href="about.html">Об институте</a>
                <a href="blog.html">Блог</a>
                <a href="contacts.html">Контакты</a>
                <a href="#enroll" class="btn btn-primary btn-sm">Записаться на обучение</a>
            </nav>"""
    content = content.replace(old_nav, new_nav)

    # Update Footer Nav 1
    old_footer_nav_1 = """                <div class="footer-nav">
                    <h4>Обучение</h4>
                    <ul>
                        <li><a href="#programs">Функциональная анатомия</a></li>
                        <li><a href="#programs">Специалист остеокоррекции</a></li>
                        <li><a href="#programs">Специалист ОстеоЭстетики</a></li>
                    </ul>
                </div>"""
    new_footer_nav_1 = """                <div class="footer-nav">
                    <h4>Обучение</h4>
                    <ul>
                        <li><a href="programs.html">Функциональная анатомия</a></li>
                        <li><a href="programs.html">Специалист остеокоррекции</a></li>
                        <li><a href="programs.html">Специалист ОстеоЭстетики</a></li>
                    </ul>
                </div>"""
    content = content.replace(old_footer_nav_1, new_footer_nav_1)

    # Update Footer Nav 2
    old_footer_nav_2 = """                <div class="footer-nav">
                    <h4>Институт</h4>
                    <ul>
                        <li><a href="#about">Об Олеге Агапэ</a></li>
                        <li><a href="#cases">Кейсы студентов</a></li>
                        <li><a href="#media">СМИ о нас</a></li>
                    </ul>
                </div>"""
    new_footer_nav_2 = """                <div class="footer-nav">
                    <h4>Институт</h4>
                    <ul>
                        <li><a href="about.html">Об Олеге Агапэ</a></li>
                        <li><a href="about.html#cases">Кейсы студентов</a></li>
                        <li><a href="about.html#media">СМИ о нас</a></li>
                    </ul>
                </div>"""
    content = content.replace(old_footer_nav_2, new_footer_nav_2)

    with open(f, 'w') as file:
        file.write(content)

# Update blog.html differently
with open('blog.html', 'r') as file:
    content = file.read()
    
old_blog_nav = """            <nav class="nav">
                <a href="index.html#programs">Программы обучения</a>
                <a href="index.html#cases">Кейсы</a>
                <a href="blog.html">Блог</a>
                <a href="index.html#contacts">Контакты</a>
                <a href="index.html#enroll" class="btn btn-primary btn-sm">Записаться на обучение</a>
            </nav>"""
content = content.replace(old_blog_nav, new_nav)
content = content.replace(old_footer_nav_1, new_footer_nav_1)
content = content.replace(old_footer_nav_2, new_footer_nav_2)

with open('blog.html', 'w') as file:
    file.write(content)

print("Links updated")
