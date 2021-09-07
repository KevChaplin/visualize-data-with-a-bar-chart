// Fetch US GDP data from API
document.addEventListener('DOMContentLoaded',function() {
  fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
    .then(response => response.json())
    .then(data => {

      const dataset = data.data
      const w = 1200
      const h = 700
      const padding = 50

      const yScale = d3.scaleLinear()
                      .domain([0, d3.max(dataset, d => d[1])])
                      .range([h- padding, padding])

      const xScale = d3.scaleBand()
                      .domain(dataset.map(d => d[0]))
                      .range([padding, w - padding])
                      .paddingInner(0.2)

      // Find which financial year quarter, return 'yyyy Qx' where x = [1 - 4] e.g. '2010 Q1'
      function findFYQ(date) {
        let year = date.substring(0,4)
        let month = date.substring(5,7)
        let quarter = Math.floor(month / 3) + 1
        return `${year} Q${quarter}`
      }

      // Create tooltip
      var tooltip = d3.select("body")
                        .append("div")
                        .attr("id", "tooltip")

      // create svg element
      const svg = d3.select("div")
                    .append("svg")
                    .attr("width", w)
                    .attr("height", h)

      // Add chart title
      let years = `${dataset[0][0].substring(0,4)}-${dataset[dataset.length - 1][0].substring(0,4)}`
      d3.select("body")
        .append("h1")
        .attr("id", "title")
        .text(`US GDP ${years}`)

      // Add y-axis
      const yAxis = d3.axisLeft(yScale)
      svg.append("g")
        .attr("id", "y-axis")
        .attr("transform", `translate(${padding}, 0)`)
        .call(yAxis)

      // Add x-axis
      // Ticks every 5th year Q1
      var ticks = xScale.domain().filter((d, i) => {
        let year = d.substring(3,4)
        let month = d.substring(6,7)
        return ( ( year == 0 || year == 5) && ( month == 1) )
        })
      // Set tick label as year only
      var tickLabels = []
      ticks.forEach(t => tickLabels.push(t.substring(0,4)))
      const xAxis = d3.axisBottom(xScale)
                      .tickValues(ticks)
                      .tickFormat((d,i) => tickLabels[i])
      svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(0, ${h - padding})`)
        .call(xAxis)

      // Set y-axis title
      svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", padding + 20)
        .attr("x", - h / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "24px")
        .text("GDP ( $ Billions )");

      // Create bar chart of US GDP data. x-axis: financial quarter. y-axis: GDP
      svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
          .attr("x", d => xScale(d[0]) )
          .attr("y", d => yScale(d[1]) )
          .attr("width", xScale.bandwidth() )
          .attr("height", d => h - padding - yScale(d[1]))
          .attr("class", "bar")
          .attr("data-date", d => d[0])
          .attr("data-gdp", d => d[1])
        // Add functions for setting tooltip value and showing/hiding tooltip
        .on("mouseover", function(e, d) {
          tooltip.text(`${findFYQ(d[0])}: $${d[1].toLocaleString()} Billion`)
          tooltip.attr("data-date", d[0])
          tooltip.style("visibility", "visible")
        })
        .on("mousemove", function() {
          tooltip
            .style("top", (event.pageY - 50)+"px")
            .style("left",(event.pageX + 20)+"px")
        })
        .on("mouseleave", function() {
          tooltip
            .style("visibility", "hidden")
        })
        // .append("title")
        //   .text(d => `${findFYQ(d[0])}: $${d[1].toLocaleString()} Billion`)
        //   .attr("id", "tooltip")


    })
})
