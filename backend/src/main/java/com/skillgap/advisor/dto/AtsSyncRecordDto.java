package com.skillgap.advisor.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AtsSyncRecordDto {
    private String provider;
    private String externalId;
    private String status;
    private String lastSynced;
}
