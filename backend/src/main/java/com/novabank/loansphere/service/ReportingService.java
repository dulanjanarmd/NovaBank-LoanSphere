package com.novabank.loansphere.service;

import com.novabank.loansphere.model.LoanApplication;
import com.novabank.loansphere.repository.LoanApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportingService {

    private final LoanApplicationRepository applicationRepository;

    public Map<String, Object> getKPIMetrics() {
        List<LoanApplication> allApplications = applicationRepository.findAll();
        
        // Calculate KPIs
        long totalApplications = allApplications.size();
        long approvedApplications = allApplications.stream()
                .filter(app -> app.getStatus().equals("APPROVED") || app.getStatus().equals("DISBURSED"))
                .count();
        long pendingApplications = allApplications.stream()
                .filter(app -> app.getStatus().equals("SUBMITTED") || app.getStatus().equals("UNDER_REVIEW"))
                .count();
        
        double approvalRate = totalApplications > 0 ? (approvedApplications * 100.0 / totalApplications) : 0;
        
        BigDecimal totalDisbursed = allApplications.stream()
                .filter(app -> app.getStatus().equals("DISBURSED"))
                .map(LoanApplication::getRequestedAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Calculate average processing time (mock calculation)
        double avgProcessingTime = 4.2; // days

        Map<String, Object> kpis = new HashMap<>();
        kpis.put("totalApplications", totalApplications);
        kpis.put("approvedApplications", approvedApplications);
        kpis.put("pendingApplications", pendingApplications);
        kpis.put("approvalRate", String.format("%.1f%%", approvalRate));
        kpis.put("totalDisbursed", totalDisbursed);
        kpis.put("avgProcessingTime", avgProcessingTime + " days");
        
        return kpis;
    }

    public Map<String, Object> getApplicationsByStatus() {
        List<LoanApplication> allApplications = applicationRepository.findAll();
        
        Map<String, Long> statusCounts = allApplications.stream()
                .collect(Collectors.groupingBy(LoanApplication::getStatus, Collectors.counting()));
        
        return new HashMap<>(statusCounts);
    }

    public Map<String, Object> getMonthlyDisbursements() {
        List<LoanApplication> allApplications = applicationRepository.findAll();
        
        // Get last 6 months data
        Map<String, BigDecimal> monthlyData = new HashMap<>();
        YearMonth currentMonth = YearMonth.now();
        
        for (int i = 5; i >= 0; i--) {
            YearMonth month = currentMonth.minusMonths(i);
            String monthKey = month.getMonth().name().substring(0, 3);
            
            BigDecimal monthTotal = allApplications.stream()
                    .filter(app -> app.getStatus().equals("DISBURSED"))
                    .filter(app -> app.getCreatedAt() != null)
                    .filter(app -> {
                        YearMonth appMonth = YearMonth.from(app.getCreatedAt());
                        return appMonth.equals(month);
                    })
                    .map(LoanApplication::getRequestedAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            monthlyData.put(monthKey, monthTotal);
        }
        
        return monthlyData;
    }

    public Map<String, Object> getProductMix() {
        List<LoanApplication> allApplications = applicationRepository.findAll();
        
        Map<String, Long> productCounts = allApplications.stream()
                .collect(Collectors.groupingBy(LoanApplication::getLoanType, Collectors.counting()));
        
        long total = allApplications.size();
        Map<String, Object> productMix = new HashMap<>();
        
        productCounts.forEach((product, count) -> {
            double percentage = total > 0 ? (count * 100.0 / total) : 0;
            productMix.put(product, String.format("%.1f%%", percentage));
        });
        
        return productMix;
    }
}
