package com.novabank.loansphere.repository;

import com.novabank.loansphere.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
    List<Notification> findByCustomerIdAndReadFalseOrderByCreatedAtDesc(Long customerId);
}
