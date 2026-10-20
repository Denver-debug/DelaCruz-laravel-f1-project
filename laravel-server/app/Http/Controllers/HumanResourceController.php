<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class HumanResourceController extends Controller
{
    // public function payroll(Request $request) {
    //     $age = $request->age;
    //     return response() -> json ([
    //         "age" => $age
    //     ]);
    // }

    

    public function payroll(Request $request) 
    {
        $employmentType = $request->employmentType;
        $positionTier = $request->positionTier;
        $daysAbsent = $request->daysAbsent;
        $minutesLate = $request->minutesLate;
        $overtimeHours = $request->overtimeHours;
        $baseSalary;
        $sss;
        $philhealth;
        $pagibig;

        if($employmentType == "COS") 
        {
            $baseSalary = 18000;
            $sss = 0;
            $philhealth = 0;
            $pagibig = 0;
            $positionTier = "None";
        }
        else 
        {
            if ($positionTier == "Junior") 
            {
                $baseSalary = 25000;
                $sss = 1125;
                $philhealth = 625;
                $pagibig = 200;

            }
            else 
            {
                $baseSalary = 40000;
                $sss = 1800;
                $philhealth = 1000;
                $pagibig = 200;
            }
        }

        $daysPresent = 22 -$daysAbsent;
        $dailyRate = round($baseSalary/22, 2);
        $hourlyRate = $dailyRate/8;
        $lateDeduction = round(($hourlyRate/60) * $minutesLate, 2);
        $absentDeduction = round($dailyRate * $daysAbsent, 2);
        $overtimePay = round($overtimeHours * ($hourlyRate * 1.25), 2);
        $grossPay = round($baseSalary - $lateDeduction - $absentDeduction + $overtimePay, 2);
        $totalDeductions = $sss + $philhealth + $pagibig;
        $netPay = round($grossPay - $totalDeductions, 2);

        return response() -> json ([
            "daysAbsent" => $daysAbsent,
            "employmentType" => $employmentType,
            "positionTier" => $positionTier,
            "baseSalary" => $baseSalary,
            "daysPresent" => $daysPresent,
            "dailyRate" => $dailyRate,
            "lateDeduction" => $lateDeduction,
            "absentDeduction" => $absentDeduction,
            "overtimePay" => $overtimePay,
            "grossPay" => $grossPay,
            "sss" => $sss,
            "philhealth" => $philhealth,
            "pagibig" => $pagibig,
            "totalDeductions" => $totalDeductions,
            "netPay" => $netPay
        ]);

    }
}
