package com.novabank.loansphere.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Data
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "audit_id")
    private Long auditId;

    @Column(name = "user_id", nullable = false, length = 50)
    private String userId;

    @Column(name = "action_type", nullable = false, length = 100)
    private String actionType;

    @Column(name = "entity_reference", nullable = false, length = 100)
    private String entityReference;

    @Column(name = "ip_address", nullable = false, length = 45)
    private String ipAddress;

    @Column(insertable = false, updatable = false)
    private LocalDateTime timestamp;

    @Column(columnDefinition = "TEXT")
    private String details;
}
