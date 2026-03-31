# Daily Focus Stack — PRD

## Konsept
Her gün sadece 3 görev. 4. göreve izin yok. Gün geçince sıfırlanır, tamamlanmayanlar arşive düşer.

## Gelir Modeli
- Fiyat: $1.99 tek seferlik (App Store / Google Play)

## Ekranlar
1. **Onboarding** — Motivasyon mesajı + START butonu (6 dilde)
2. **Home (Today)** — Yerelleştirilmiş tarih başlığı, 3 görev slotu, tamamlama animasyonu, 3/3 kutlama
3. **History** — Takvim görünümü (yeşil/sarı/kırmızı), streak sayacı
4. **Settings** — Dil seçici, bildirim saati, karanlık/açık tema, uygulama ikonu

## Çok Dil Desteği (i18n)
- 🇺🇸 English
- 🇸🇦 العربية (Arabic) — **Tam RTL düzen desteği**
- 🇩🇪 Deutsch (German)
- 🇷🇺 Русский (Russian)
- 🇪🇸 Español (Spanish)
- 🇧🇬 Български (Bulgarian)

**Otomatik Algılama:** Cihaz dilini tespit eder, destekleniyorsa uygular, yoksa İngilizce kullanır.
**Manuel Değiştirici:** Ayarlar ekranındaki dil seçiciden anında değiştirilir.

## Teknik Detaylar
- **Framework:** React Native (Expo SDK 54) + expo-router
- **Veri Saklama:** AsyncStorage (tamamen yerel, backend'siz)
- **Bildirimler:** expo-notifications (yerel zamanlı bildirimler)
- **Animasyonlar:** react-native-reanimated + expo-haptics
- **Yerelleştirme:** expo-localization + özel i18n sistemi
- **RTL:** I18nManager + style-based RTL (writingDirection, flexDirection)
- **Tema:** Karanlık (#0A0A0A) / Açık (#F5F2ED), amber vurgu (#FF6B00)
- **Fontlar:** Serif (Georgia) + Mono (Courier New)

## Kesinlikle Olmayanlar
- Kategori / etiket yok
- Öncelik seviyesi yok
- Alt görev yok
- Paylaşım / sosyal yok
- Auth / kullanıcı girişi yok
