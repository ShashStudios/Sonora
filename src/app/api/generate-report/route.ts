export async function POST(request: Request) {
  try {
    const { assumptions, metrics, summary } = await request.json();
    
    console.log('API Route called with:', { assumptions, metrics: metrics?.length, summary });
    
    const apiKey = process.env.AZURE_OPENAI_API_KEY;
    const endpoint = 'https://actuarychat.openai.azure.com/openai/deployments/doc-gen/chat/completions?api-version=2025-01-01-preview';
    
    if (!apiKey) {
      console.error('AZURE_OPENAI_API_KEY not found');
      return Response.json({ 
        error: 'API key not configured', 
        success: false 
      }, { status: 500 });
    }

    const prompt = `Generate a professional hotel pro forma report with the following data:

HOTEL ASSUMPTIONS:
- Number of Rooms: ${assumptions.numberOfRooms}
- Base Occupancy Rate: ${assumptions.baseOccupancyRate}%
- Base ADR: $${assumptions.baseADR}
- ADR Growth Rate: ${assumptions.adrGrowthRate}%
- Occupancy Growth Rate: ${assumptions.occupancyGrowthRate}%
- Expense Growth Rate: ${assumptions.expenseGrowthRate}%

5-YEAR FINANCIAL PROJECTIONS:
${metrics.map(metric => `
Year ${metric.year}:
  Occupancy: ${metric.occupancy.toFixed(1)}%
  ADR: $${metric.adr.toLocaleString()}
  RevPAR: $${metric.revpar.toLocaleString()}
  Total Revenue: $${metric.totalRevenue.toLocaleString()}
  Total Expenses: $${metric.totalExpenses.toLocaleString()}
  NOI: $${metric.noi.toLocaleString()}
  NOI Margin: ${metric.noiMargin.toFixed(1)}%
`).join('')}

KEY METRICS SUMMARY:
- Year 5 Total Revenue: $${summary.totalRevenue.toLocaleString()}
- Year 5 Total Expenses: $${summary.totalExpenses.toLocaleString()}
- Year 5 NOI: $${summary.noi.toLocaleString()}
- Year 5 Occupancy: ${summary.occupancy.toFixed(1)}%
- Year 5 RevPAR: $${summary.revpar.toFixed(0)}

Please generate a comprehensive professional report that includes:

1. EXECUTIVE SUMMARY
Provide a high-level overview of the hotel's financial performance and key insights.

2. HOTEL OVERVIEW AND ASSUMPTIONS
Explain the property characteristics and growth assumptions in clear, professional language.

3. FINANCIAL PERFORMANCE ANALYSIS
Analyze the 5-year financial trends, focusing on:
- Revenue growth patterns and drivers
- Expense management challenges
- NOI margin trends and implications
- Key financial insights and observations

4. KEY PERFORMANCE INDICATORS
Highlight the most important metrics and what they indicate about the hotel's performance.

5. RISK ASSESSMENT
Identify potential risks and their impact on the hotel's financial performance.

6. RECOMMENDATIONS
Provide actionable strategies to improve performance and mitigate risks.

7. CONCLUSION
Summarize the investment opportunity and key takeaways.

IMPORTANT FORMATTING REQUIREMENTS:
- Do NOT use markdown formatting (no #, ##, ###, **, *, etc.)
- Do NOT create tables with | symbols
- Use plain text with clear section headers
- Write in a professional, business-ready style
- Focus on insights and analysis, not just data presentation
- Use bullet points with - symbols for lists
- Keep paragraphs concise and informative

The report should be suitable for investors and stakeholders, providing valuable insights beyond just the raw numbers.`;

    console.log('Making request to Azure OpenAI...');
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Azure OpenAI error:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    console.log('Azure OpenAI response received');
    
    return Response.json({ 
      report: data.choices[0].message.content,
      success: true 
    });
  } catch (error) {
    console.error('Error generating report:', error);
    return Response.json({ 
      error: 'Failed to generate report', 
      details: error instanceof Error ? error.message : 'Unknown error',
      success: false 
    }, { status: 500 });
  }
}
