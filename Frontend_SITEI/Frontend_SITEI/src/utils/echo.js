import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Membuat Pusher tersedia secara global agar Echo bisa menemukannya
window.Pusher = Pusher;

const echo = new Echo({
    broadcaster: 'pusher',
    key: '8fa079901658b3c9fc35', // Key Anda
    cluster: 'ap1',             // Cluster Anda
    forceTLS: true,
    // Jika nanti Anda menggunakan Private Channel, tambahkan konfigurasi auth di sini
});

export default echo;