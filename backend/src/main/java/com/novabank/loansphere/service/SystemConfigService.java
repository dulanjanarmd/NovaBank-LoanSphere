package com.novabank.loansphere.service;

import com.novabank.loansphere.model.SystemConfig;
import com.novabank.loansphere.repository.SystemConfigRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * System Configuration Service (FR-ADM-03)
 * Allows admins to configure score thresholds, DTI/LTV limits, SLA days etc.
 */
@Service
@RequiredArgsConstructor
public class SystemConfigService {

    private final SystemConfigRepository configRepository;

    public List<SystemConfig> getAllConfigs() {
        return configRepository.findAll();
    }

    public Optional<SystemConfig> getConfig(String key) {
        return configRepository.findByConfigKey(key);
    }

    public String getConfigValue(String key, String defaultValue) {
        return configRepository.findByConfigKey(key)
                .map(SystemConfig::getConfigValue)
                .orElse(defaultValue);
    }

    @Transactional
    public SystemConfig updateConfig(String key, String value, String updatedBy) {
        SystemConfig config = configRepository.findByConfigKey(key)
                .orElseGet(() -> {
                    SystemConfig newConfig = new SystemConfig();
                    newConfig.setConfigKey(key);
                    return newConfig;
                });
        config.setConfigValue(value);
        config.setUpdatedBy(updatedBy);
        return configRepository.save(config);
    }

    @Transactional
    public void bulkUpdate(Map<String, String> updates, String updatedBy) {
        for (Map.Entry<String, String> entry : updates.entrySet()) {
            updateConfig(entry.getKey(), entry.getValue(), updatedBy);
        }
    }
}
