# Otakudesu Scraping

Streaming dan download Anime subtitle Indonesia

# Sumber:

https://otakudesu.media

# Instalasi

- Jalankan perintah di terminal

```sh
# clone repo
git clone https://github.com/MastayY/otakudesu-scraping.git

# masuk folder
cd otakudesu-scraping

# install dependensi
npm install

# jalankan server
npm start
```

- Server akan berjalan di http://localhost:3000

# Routes

| Endpoint              | Params          | Description                |
| --------------------- | --------------- | -------------------------- |
| /home                 | -               | Homepage                   |
| /schedule             | -               | Jadwal Tayang              |
| /ongoing              | page            | default page: 1            |
| /completed            | page            | default page: 1            |
| /genres               | -               | Genre List                 |
| /genre/:id            | :id, page       | default page: 1            |
| /search               | query           | Search Anime               |
| /anime/:id            | :id             | Anime details              |
| /episode/:id          | :id             | Streaming Anime            |
