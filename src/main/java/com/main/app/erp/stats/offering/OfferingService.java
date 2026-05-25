package com.main.app.erp.stats.offering;

import com.main.app.erp.stats.offering.dto.OfferingDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service("erpStatsOfferingService")
@RequiredArgsConstructor
public class OfferingService {

    private final OfferingMapper offeringMapper;

    public List<OfferingDto.OfferingStat> getOfferingStats(String year, String month) {
        try {
            return offeringMapper.selectOfferingStats(year, month);
        } catch (Exception ignored) {
            return Collections.emptyList();
        }
    }
}
