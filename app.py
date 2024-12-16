from flask import Flask, render_template
from datetime import datetime

app = Flask(__name__)

# Data for devotionals
devotionals = {
    "2024-01-01": "Trust in the Lord with all your heart and lean not on your own understanding. — Proverbs 3:5-6",
    "2024-01-02": "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go. — Joshua 1:9",
}

memory_verses = {
    "2024-01-01": "Commit your way to the Lord; trust in Him and He will do this. — Psalm 37:5",
    "2024-01-02": "For I know the plans I have for you, declares the Lord. — Jeremiah 29:11",
}

@app.route('/')
def daily_devotional():
    today = datetime.now().strftime('%Y-%m-%d')
    devotional = devotionals.get(today, "No devotional for today. Check back tomorrow!")
    memory_verse = memory_verses.get(today, "No memory verse available for today.")
    return render_template('index.html', devotional=devotional, memory_verse=memory_verse)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
