package com.carequeue.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DayAvailability {
    private String dayOfWeek; // e.g. "MONDAY", "TUESDAY"
    private String startTime; // e.g. "09:00"
    private String endTime;   // e.g. "13:00"
    @Builder.Default
    private int slotDurationMinutes = 30;
    @Builder.Default
    private boolean available = true;
}
