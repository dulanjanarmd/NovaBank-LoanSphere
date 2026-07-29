package com.novabank.loansphere.service;

import com.novabank.loansphere.model.AuditLog;
import com.novabank.loansphere.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

@Aspect
@Component
@RequiredArgsConstructor
public class AuditAspect {

    private final AuditLogRepository auditLogRepository;

    @AfterReturning(pointcut = "execution(* com.novabank.loansphere.controller.AdminController.updateProduct(..))", returning = "result")
    public void logProductUpdate(JoinPoint joinPoint, Object result) {
        saveLog("ADMIN", "UPDATE_PRODUCT", "Product updated: " + joinPoint.getArgs()[0]);
    }

    @AfterReturning(pointcut = "execution(* com.novabank.loansphere.service.StaffService.processApproval(..))", returning = "result")
    public void logApproval(JoinPoint joinPoint, Object result) {
        saveLog("STAFF", "PROCESS_APPROVAL", "Approval processed by " + joinPoint.getArgs()[1]);
    }

    @AfterReturning(pointcut = "execution(* com.novabank.loansphere.service.StaffService.disburse(..))", returning = "result")
    public void logDisbursement(JoinPoint joinPoint, Object result) {
        saveLog("STAFF", "DISBURSE", "Disbursed application " + joinPoint.getArgs()[0]);
    }

    private void saveLog(String userId, String action, String details) {
        AuditLog log = new AuditLog();
        log.setUserId(userId);
        log.setActionType(action);
        log.setEntityReference("SYSTEM");
        log.setIpAddress("127.0.0.1");
        log.setDetails(details);
        auditLogRepository.save(log);
    }
}
