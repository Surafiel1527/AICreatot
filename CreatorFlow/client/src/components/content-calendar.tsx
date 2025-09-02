import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";

export function ContentCalendar() {
  const { data: calendarData } = useQuery({
    queryKey: ["/api/content-calendar"],
    retry: false,
  });

  // Mock calendar data
  const mockCalendarData = [
    {
      date: "Today",
      dateLabel: "Nov 15",
      items: [
        {
          id: "1",
          type: "YouTube Upload",
          title: "Morning Routine 2024",
          time: "2:00 PM",
          platform: "youtube",
          color: "accent"
        }
      ]
    },
    {
      date: "Tomorrow", 
      dateLabel: "Nov 16",
      items: [
        {
          id: "2",
          type: "TikTok Post",
          title: "Quick Study Tips",
          time: "10:00 AM",
          platform: "tiktok",
          color: "primary"
        },
        {
          id: "3",
          type: "Instagram Reel",
          title: "Aesthetic Workspace",
          time: "6:00 PM",
          platform: "instagram",
          color: "secondary"
        }
      ]
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <i className="fas fa-calendar text-secondary mr-2"></i>
          Content Calendar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockCalendarData.map((day, dayIndex) => (
            <div key={dayIndex}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">{day.date}</span>
                <span className="text-xs text-muted-foreground">{day.dateLabel}</span>
              </div>
              <div className="space-y-2">
                {day.items.map((item) => (
                  <div 
                    key={item.id} 
                    className={`p-3 rounded-lg border-l-4 ${
                      item.color === 'accent' ? 'bg-accent/10 border-accent' :
                      item.color === 'primary' ? 'bg-primary/10 border-primary' :
                      'bg-secondary/10 border-secondary'
                    }`}
                    data-testid={`calendar-item-${item.id}`}
                  >
                    <div className="text-sm font-medium" data-testid={`item-type-${item.id}`}>
                      {item.type}
                    </div>
                    <div className="text-xs text-muted-foreground" data-testid={`item-title-${item.id}`}>
                      {item.title}
                    </div>
                    <div className={`text-xs mt-1 ${
                      item.color === 'accent' ? 'text-accent' :
                      item.color === 'primary' ? 'text-primary' :
                      'text-secondary'
                    }`} data-testid={`item-time-${item.id}`}>
                      {item.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {/* This Week Summary */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">This Week</span>
              <Button variant="ghost" size="sm" className="text-xs text-primary hover:text-secondary" data-testid="button-view-all-calendar">
                View All
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">
              6 posts scheduled • 3 platforms
            </div>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full mt-4" 
          data-testid="button-schedule-content"
        >
          <i className="fas fa-plus mr-2"></i>Schedule Content
        </Button>
      </CardContent>
    </Card>
  );
}
