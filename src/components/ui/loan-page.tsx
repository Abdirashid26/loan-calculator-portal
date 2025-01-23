import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";

export function LoanPage({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [loanAmount, setLoanAmount] = useState("");
  const [annualInterestRate, setAnnualInterestRate] = useState("");
  const [loanPeriod, setLoanPeriod] = useState("");
  const [loanPeriodUnit, setLoanPeriodUnit] = useState("");
  const [repaymentFrequency, setRepaymentFrequency] = useState("");
  const [interestType, setInterestType] = useState("");
  const [repaymentData, setRepaymentData] = useState<any>(null);
  const [repaymentSchedule, setRepaymentSchedule] = useState<any[]>([]);
  const [repaymentFlag, setRepaymentFlag] = useState<boolean>(false);

  const generatePayload = () => {
    return {
      loanAmount: parseFloat(loanAmount),
      annualInterestRate: parseFloat(annualInterestRate),
      loanPeriod: parseFloat(loanPeriod),
      loanPeriodUnit,
      repaymentFrequency,
      interestType,
    };
  };

  const clearData = () => {
    setLoanAmount("");
    setAnnualInterestRate("");
    setLoanPeriod("");
    setLoanPeriodUnit("");
    setRepaymentFrequency("");
    setInterestType("");
    setRepaymentData(null);
    setRepaymentSchedule([]);
    setRepaymentFlag(false);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const payload = generatePayload();
    console.log(payload);

    hitCalculate(payload);
  };

  const hitCalculate = async (payload: any) => {
    console.log(payload);
    

    const url = "http://104.154.76.3:7123/api/v1/loan/calculate-payment-schedule";
    const model = payload;
    const token = localStorage.getItem("token");


    try {
      const response = await axios.post(url, model, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data) {
        toast({
          title: `Success`,
        });
        console.log(response.data.data.paymentSchedule);

        if (response.data.status == "00") {
          console.log(response.data);
          console.log(response.data.data);
          setRepaymentSchedule(response.data.data.paymentSchedule);
          setRepaymentData(response.data.data);
        }

        setTimeout(() => {
          toast({}).dismiss();
        }, 1000);
      }
    } catch (error: any) {
      console.log(error);

      toast({
        title: `Error: ${error["message"]}`,
      });

      setTimeout(() => {
        toast({}).dismiss();
      }, 2000);
    }
  };

  useEffect(() => {
    if (repaymentSchedule.length !== 0) {
      console.log("Repayment data updated:", repaymentSchedule);
      setRepaymentFlag(true);
    }
  }, [repaymentSchedule]);

  return (
    <>
      {!repaymentFlag ? (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Loan Calculator & Repayment
              </CardTitle>
              <CardDescription>
                Enter the loan details to calculate your repayment amount.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="loanAmount">Loan Amount</Label>
                    <Input
                      id="loanAmount"
                      type="number"
                      placeholder="Enter loan amount"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)}
                      required
                      min="0"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="interestType">Interest Type</Label>
                    <select
                        id="interestType"
                        className="border rounded px-3 py-2 bg-white text-black"
                        value={interestType}
                        onChange={(e) => setInterestType(e.target.value)}
                        required
                    >
                      <option value="" disabled>
                        Select interest type
                      </option>
                      <option value="REDUCING_BALANCE">Reducing Balance</option>
                      <option value="FLAT">Flat</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                  <Label htmlFor="annualInterestRate">
                      Annual Interest Rate (%)
                    </Label>
                    <Input
                      id="annualInterestRate"
                      type="number"
                      placeholder="Enter annual interest rate"
                      value={annualInterestRate}
                      onChange={(e) => setAnnualInterestRate(e.target.value)}
                      required
                      min="0"
                      step="0.1"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="loanPeriodUnit">Loan Period Unit</Label>
                    <select
                      id="loanPeriodUnit"
                      className="border rounded px-3 py-2 bg-white text-black"
                      value={loanPeriodUnit}
                      onChange={(e) => setLoanPeriodUnit(e.target.value)}
                      required
                    >
                      <option value="" disabled>
                        Select loan period unit
                      </option>
                      <option value="DAYS">Days</option>
                      <option value="WEEKS">Weeks</option>
                      <option value="MONTHS">Months</option>
                      <option value="YEARS">Years</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="loanPeriod">Loan Period</Label>
                    <Input
                      id="loanPeriod"
                      type="number"
                      placeholder="Enter loan period"
                      value={loanPeriod}
                      onChange={(e) => setLoanPeriod(e.target.value)}
                      required
                      min="0"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="repaymentFrequency">
                      Repayment Frequency
                    </Label>
                    <select
                      id="repaymentFrequency"
                      className="border rounded px-3 py-2 bg-white text-black"
                      value={repaymentFrequency}
                      onChange={(e) => setRepaymentFrequency(e.target.value)}
                      required
                    >
                      <option value="" disabled>
                        Select repayment frequency
                      </option>
                      <option value="DAILY">Daily</option>
                      <option value="WEEKLY">Weekly</option>
                      <option value="MONTHLY">Monthly</option>
                      <option value="QUARTERLY">Quarterly</option>
                      <option value="ANNUALLY">Annually</option>
                    </select>
                  </div>

                  <Button type="submit" className="w-full">
                    Calculate Repayment
                  </Button>
                </div>
                <Toaster />
              </form>
            </CardContent>
          </Card>
        </div>
      ) : (
          <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">
                  Loan Calculator / Repayment Schedule
                </CardTitle>
                <CardDescription>
                  View the loan repayment schedule to see your repayment cycles.
                  <br/>
                  <div className="flex flex-col m-2">
                    <div className="flex flex-row justify-between my-1">
                      <p className="font-bold">Total Loan Amount</p>
                      <p className="font-medium">KES {repaymentData.totalLoanAmount}</p>
                    </div>
                    <div className="flex flex-row justify-between my-1">
                      <p className="font-bold">Total Interest Paid</p>
                      <p className="font-medium" >KES {repaymentData.totalInterestPaid}</p>
                    </div>
                    <div className="flex flex-row justify-between my-1">
                      <p className="font-bold">Total Amount Paid</p>
                      <p className="font-medium" >KES {repaymentData.totalAmountPaid}</p>
                    </div>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Table structure */}
                <div className="overflow-x-auto">
                  <table className="table-auto w-full border-collapse border border-gray-200">
                    <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left">Payment No</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Payment Amount</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Principal Amount</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Interest Amount</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Remaining Balance</th>
                    </tr>
                    </thead>
                    <tbody>
                    {repaymentSchedule.map((invoice) => (
                        <tr key={invoice.paymentNumber}>
                          <td className="border border-gray-300 px-4 py-2">{invoice.paymentNumber}</td>
                          <td className="border border-gray-300 px-4 py-2">KES {invoice.paymentAmount}</td>
                          <td className="border border-gray-300 px-4 py-2">KES {invoice.principalAmount}</td>
                          <td className="border border-gray-300 px-4 py-2">KES {invoice.interestAmount}</td>
                          <td className="border border-gray-300 px-4 py-2">KES {invoice.remainingBalance}</td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>

                <Button
                    type="submit"
                    onClick={() => clearData()}
                    className="w-full mt-4"
                >
                  Calculate Again
                </Button>
                <Toaster />
              </CardContent>
            </Card>
          </div>
      )}
    </>
  );
}
