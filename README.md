# Lavuks FK Dashboard

EA SPORTS FC Clubs kulüp ve oyuncu dashboard’u. Vinext + Vite + Cloudflare Workers.

## Gereksinimler ve yerel çalıştırma

- Node.js 24 LTS (package.json alt sınırı: 22.13)
- pnpm 11.25.0

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Yerel adres: http://localhost:5173

```sh
pnpm build
pnpm start
```

`pnpm start`, üretilen Cloudflare Worker’ı yerelde çalıştırır; terminalde yazan adresi kullanın.
Bu komutlar siteyi internete yayınlamaz. Yeni bir bilgisayarda yürütme profili otomatik olarak portable seçilir.

## Ana dosyalar

- `dashboard.html`: tüm dashboard arayüzü, CSS ve tarayıcı tarafı etkileşimler.
- `app/route.ts`: dashboard HTML’ini sunan ana rota.
- `app/api/fcclub/[resource]/route.ts`: FCClub API rotası.
- `lib/fcclub.js`: sunucu tarafı API erişimi, oyuncu izin listesi, 5 dakika önbellek ve hata yönetimi.
- `public/data.json`: EA maçları, oyuncular, teknik direktör planları, scout metinleri ve fotoğraf kaynakları.
- `public/fcclub-snapshot.json`: FCClub API ulaşılamadığında kullanılan kaydedilmiş kopya.
- `public/assets/`: teknik direktör fotoğrafları.
- `vite.config.ts`, `build/`, `scripts/`: derleme ve Worker altyapısı.

## API

```text
GET /api/fcclub/profile?player=ElectKnightFghtr
GET /api/fcclub/matches?player=ElectKnightFghtr
GET /api/fcclub/club
```

Kulüp: Lavuks FK / 1546086. Yalnızca mevcut dokuz oyuncu için istek kabul edilir.
FCClub verisi sunucudan alınır; API anahtarı gerekmez. Yanıtlar beş dakika önbelleğe alınır.
Arka planda zamanlanmış veri toplama veya kalıcı maç arşivleme kurulmuş değildir.
EA verileri dosyadaki anlık görüntüdür; otomatik yenilenmez. FCClub, EA’dan ayrı kapsamda gösterilir.

## İstatistik kuralları

- Kaleci değerleri yalnızca kaleci oynanan maçlardan hesaplanır.
- FCClub maç ortalamaları/per90 yalnızca süresi sıfırdan büyük kayıtlara dayanır.
- per90 paydası API’nin secondsPlayed alanından bulunan oyun içi dakikadır.
- Kodlu EA olayları topluluk araştırmasının eşleştirmeleridir; resmî EA tanımları değildir.
- Kaynaklar birleştirilip iki kez toplanmaz.

Olay eşleştirme kaynağı:
https://github.com/Interactive-63/eafc-pro-clubs-api-research

Fotoğraf yazarları, lisansları ve kaynak bağlantıları `public/data.json` içindeki managers[].photoCredit ve photoSource alanlarında bulunur; arayüzde de gösterilir. Fotoğraflar boyutlandırılmıştır. Lisans koşullarını koruyun.

## Dışa aktarma notları

Bu repo, yayındaki projenin kaynak kodlarını içerir. node_modules, derlenmiş dist, Git geçmişi, yerel önbellekler ve kimlik bilgileri dahil değildir. Bağımlılıklar kurulum sırasında indirilir.
Mevcut yayındaki sitenin project_id kimliği dışa aktarılan `.openai/hosting.json` dosyasından kaldırılmıştır. Başka bir ortamda yayınlamak için kendi hosting ayarlarınızı kullanın.

## Dostluk maçları

EA anlık görüntüsünde lig/playoff yanında 3 dostluk maçı bulunur. Dostluklar ayrı filtrelenir ve oyuncu kartlarında ayrı gösterilir. Bu maçlarda gelişmiş olay verileri boş olduğu için bu alanlar sıfır olarak yorumlanmaz.
