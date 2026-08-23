<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;

class NotificationSent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;

    public function __construct($message)
    {
        // $message berupa array: ['title' => '...', 'desc' => '...', 'type' => '...']
        $this->message = $message;
    }

    public function broadcastOn()
    {
        // Nama channel yang didengarkan React
        return new Channel('notif-channel');
    }

    public function broadcastAs()
    {
        // Nama event/sinyal
        return 'notif-event';
    }
}