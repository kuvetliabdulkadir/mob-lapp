# Daily Focus Stack — PRD

## Konsept
Her gün sadece 3 görev. 4. göreve izin yok. Gün geçince sıfırlanır, tamamlanmayanlar arşive düşer.

## Gelir Modeli
- Fiyat: $1.99 tek seferlik (App Store / Google Play)

## Ekranlar
1. **Onboarding** — Tek ekran, "Sen her şeyi yapmaya çalışıyorsun. Bu yüzden hiçbirini bitiremiyorsun." mesajı + BAŞLA butonu
2. **Home (Bugün)** — Türkçe tarih başlığı, 3 görev slotu, tamamlama animasyonu, 3/3 kutlama
3. **History (Geçmiş)** — Takvim görünümü (yeşil/sarı/kırmızı renk kodlu), streak sayacı
4. **Settings (Ayarlar)** — Bildirim saati seçimi, karanlık/açık tema, uygulama ikonu seçimi

## Teknik Detaylar
- **Framework:** React Native (Expo SDK 54) + expo-router
- **Veri Saklama:** AsyncStorage (tamamen yerel, backend'siz)
- **Bildirimler:** expo-notifications (yerel zamanlı bildirimler)
- **Animasyonlar:** react-native-reanimated + expo-haptics
- **Tema:** Karanlık (#0A0A0A) / Açık (#F5F2ED), amber vurgu (#FF6B00)
- **Fontlar:** Serif (Georgia) + Mono (Courier New)

## Kesinlikle Olmayanlar
- Kategori / etiket yok
- Öncelik seviyesi yok
- Alt görev yok
- Paylaşım / sosyal yok
- Auth / kullanıcı girişi yok
