package com.novabank.loansphere.service;

import com.novabank.loansphere.model.Notification;
import com.novabank.loansphere.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Transactional
    public Notification createNotification(Long customerId, String title, String body, String type) {
        Notification notification = new Notification();
        notification.setCustomerId(customerId);
        notification.setTitle(title);
        notification.setBody(body);
        notification.setType(type);
        notification.setRead(false);
        return notificationRepository.save(notification);
    }

    public List<Notification> getCustomerNotifications(Long customerId) {
        return notificationRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
    }

    public List<Notification> getUnreadNotifications(Long customerId) {
        return notificationRepository.findByCustomerIdAndReadFalseOrderByCreatedAtDesc(customerId);
    }

    @Transactional
    public Notification markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    @Transactional
    public void markAllAsRead(Long customerId) {
        List<Notification> unread = notificationRepository.findByCustomerIdAndReadFalseOrderByCreatedAtDesc(customerId);
        unread.forEach(notification -> notification.setRead(true));
        notificationRepository.saveAll(unread);
    }
}
