import React, { useEffect, useState } from "react";
import { FormControl, FormLabel, Select, VStack } from "@chakra-ui/react";
import { PolicyService } from "../services/policies";
import { REGION } from "../models/enumerations/region";
import HighchartsReact from "highcharts-react-official";
import * as Highcharts from "highcharts";

export const Statistics = () => {
  const [statistics, setStatistics] = useState<any[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [region, setRegion] = useState(REGION.North);
  const [options, setOptions] = useState({});

  const policyService = new PolicyService();

  useEffect(() => {
    policyService.getMonthlyStatistics(region).then((success: any[]) => {
      let templabels: string[] = [];
      for (const s of success) {
        if (!templabels.includes(s.month)) {
          templabels.push(s.month);
        }
      }
      setLabels(templabels);
      setStatistics(success);
    });
  }, [region]);

  useEffect(() => {
    const data = statistics.map((s) => Number(s.count));
    setOptions({
      title: {
        text: "Monthwise policy statistics",
      },
      yAxis: {
        title: {
          text: "Number of policies",
        },
      },

      xAxis: {
        categories: labels,
        crosshair: true,
        lineWidth: 0,
        gridLineWidth: 0,

        min: 0,
      },

      legend: {
        layout: "vertical",
        align: "right",
        verticalAlign: "middle",
      },

      // plotOptions: {
      //   series: {
      //     label: {
      //       connectorAllowed: false,
      //     },
      //     pointStart: "Jan",
      //   },
      // },

      series: [
        {
          name: "Policies",
          data: data,
        },
      ],

      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500,
            },
            chartOptions: {
              legend: {
                layout: "horizontal",
                align: "center",
                verticalAlign: "bottom",
              },
            },
          },
        ],
      },
    });
  }, [statistics, labels]);

  const handleRegionChange = (event: any) => {
    setRegion(event.target.value);
  };

  return (
    <VStack justifySelf="flex-start" spacing={4} align="stretch" w="50vw">
      <FormControl mt={4}>
        <FormLabel>Select Region</FormLabel>
        <Select
          value={region}
          onChange={handleRegionChange}
          placeholder="Select region"
        >
          <option value="North">North</option>
          <option value="South">South</option>
          <option value="West">West</option>
          <option value="East">East</option>
        </Select>
      </FormControl>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </VStack>
  );
};
