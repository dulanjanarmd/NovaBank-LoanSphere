package com.novabank.loansphere.service;

import com.novabank.loansphere.model.CreditAssessment;
import com.novabank.loansphere.model.Customer;
import com.novabank.loansphere.model.LoanApplication;
import com.novabank.loansphere.model.LoanProduct;
import com.novabank.loansphere.repository.CreditAssessmentRepository;
import com.novabank.loansphere.repository.CustomerRepository;
import com.novabank.loansphere.repository.LoanApplicationRepository;
import com.novabank.loansphere.repository.LoanProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class LoanService {

    private final LoanApplicationRepository applicationRepository;
    private final LoanProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final CreditAssessmentRepository assessmentRepository;

    @Transactional
    public LoanApplication submitApplication(Long customerId, Long productId, String loanType, BigDecimal amount, int tenureMonths) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
                
        LoanProduct product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (amount.compareTo(product.getMinAmount()) < 0 || amount.compareTo(product.getMaxAmount()) > 0) {
            throw new RuntimeException("Requested amount is outside the allowed product limits.");
        }

        LoanApplication application = new LoanApplication();
        application.setCustomer(customer);
        application.setLoanProduct(product);
        application.setLoanType(loanType);
        application.setRequestedAmount(amount);
        application.setTenureMonths(tenureMonths);
        application.setApplicationRef("NBLS-LN-" + loanType + "-" + System.currentTimeMillis() / 1000);
        application.setSubmittedAt(LocalDateTime.now());
        
        LoanApplication savedApp = applicationRepository.save(application);

        // Auto-run credit assessment simulation
        runCreditAssessment(savedApp);
        
        return savedApp;
    }

    private void runCreditAssessment(LoanApplication app) {
        CreditAssessment assessment = new CreditAssessment();
        assessment.setLoanApplication(app);
        
        // Mock scoring logic
        int internalScore = 650 + (int)(Math.random() * 250); 
        assessment.setInternalScore(internalScore);
        assessment.setCribReference("CRIB-REF-" + System.currentTimeMillis());
        
        // Mock DTI logic (Request Amount / 24) / 150000 * 100
        BigDecimal annualDebt = app.getRequestedAmount().divide(new BigDecimal(24), 2, RoundingMode.HALF_UP);
        BigDecimal income = new BigDecimal(150000); // hardcoded mock income
        BigDecimal dti = annualDebt.divide(income, 2, RoundingMode.HALF_UP).multiply(new BigDecimal(100));
        assessment.setDtiRatio(dti);
        
        if (internalScore > 750 && dti.compareTo(new BigDecimal(40)) < 0) {
            assessment.setDecisionBand("AUTO_APPROVE");
        } else if (internalScore < 600) {
            assessment.setDecisionBand("AUTO_DECLINE");
        } else {
            assessment.setDecisionBand("MANUAL_REVIEW");
        }
        
        assessmentRepository.save(assessment);
    }
}
