import { Icon } from '@/components/ui/icon';
import { Label } from '@/components/ui/label';
import { lightenHexColor } from '@/lib/utils';
import React from 'react'

interface SeasonPeriod {
    beginSellDate: string;
    endSellDate: string;
    weekdays: string[];
}

interface ExistedSeasonCardProps {
    setSelectedSeason: (season: string | null) => void;
    setExistedSeasonDAta: (data: SeasonPeriod[] | null) => void;
    setValue: any;
    selectedSeason: string | null;
    existedSeasonData: SeasonPeriod[] | null;
}

function ExistedSeasonCard({setSelectedSeason,setExistedSeasonDAta,setValue,selectedSeason,existedSeasonData}:ExistedSeasonCardProps) {
  return (
    <div className="border p-4 rounded-xl mb-6 space-y-4 col-span-2 relative">
        <span className="absolute top-2 right-2 cursor-pointer" onClick={() =>{setSelectedSeason("");setExistedSeasonDAta(null);setValue("seasonPeriods", []);}}>
        <Icon name="X" className="text-primary"/>
        </span>
        <div className="flex items-center gap-2">
        <Label
            className="text-lg font-semibold text-primary"
        >
            {selectedSeason?.toUpperCase()}
        </Label>
        <span
            className="px-2 py-1 text-xs font-medium rounded-full text-primary"
        >
            {existedSeasonData && existedSeasonData.length} periods
        </span>
        </div>

        <div className="space-y-4">
        {existedSeasonData && existedSeasonData.map((period: SeasonPeriod, idx: number) => (
            <div
            key={idx}
            className="p-4 bg-white border rounded-xl"
            >
            <div className="grid sm:grid-cols-2 gap-4">
                <div>
                <p className="text-sm text-gray-500">Begin Selling Date</p>
                <p className="text-base font-medium text-primary">
                    {period.beginSellDate}
                </p>
                </div>
                <div>
                <p className="text-sm text-gray-500">End Selling Date</p>
                <p className="text-base font-medium text-primary">
                    {period.endSellDate}
                </p>
                </div>
            </div>

            <div className="mt-3">
                <p className="text-sm text-gray-500 mb-1">Weekdays</p>
                <div className="flex flex-wrap gap-2">
                {period.weekdays && period.weekdays.length > 0 ? (
                    period.weekdays.map((day) => (
                    <span
                        key={day}
                        className="px-3 py-1 text-xs font-medium rounded-full bg-primary text-white"
                    >
                        {day}
                    </span>
                    ))
                ) : (
                    <span className="text-sm text-gray-400 italic">
                    No weekdays selected
                    </span>
                )}
                </div>
            </div>
            </div>
        ))}
        </div>
    </div>
   
  )
}

export default ExistedSeasonCard