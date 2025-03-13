{
  "layout": "linear",
  "xDomain": {"chromosome": "chr3", "interval": [52168000, 52890000]},
  "arrangement": "horizontal",
  "views": [
    {
      "arrangement": "vertical",
      "views": [
        {
          "alignment": "overlay",
          "title": "Corces et al.",
          "data": {
            "url": "https://server.gosling-lang.org/api/v1/tileset_info/?d=gene-annotation",
            "type": "beddb",
            "genomicFields": [
              {"index": 1, "name": "start"},
              {"index": 2, "name": "end"}
            ],
            "valueFields": [
              {"index": 5, "name": "strand", "type": "nominal"},
              {"index": 3, "name": "name", "type": "nominal"}
            ],
            "exonIntervalFields": [
              {"index": 12, "name": "start"},
              {"index": 13, "name": "end"}
            ]
          },
          "tracks": [
            {
              "dataTransform": [
                {"type": "filter", "field": "type", "oneOf": ["gene"]},
                {"type": "filter", "field": "strand", "oneOf": ["+"]}
              ],
              "mark": "text",
              "text": {"field": "name", "type": "nominal"},
              "x": {"field": "start", "type": "genomic"},
              "xe": {"field": "end", "type": "genomic"},
              "size": {"value": 8},
              "style": {"textFontSize": 8, "dy": -12}
            },
            {
              "dataTransform": [
                {"type": "filter", "field": "type", "oneOf": ["gene"]},
                {"type": "filter", "field": "strand", "oneOf": ["-"]}
              ],
              "mark": "text",
              "text": {"field": "name", "type": "nominal"},
              "x": {"field": "start", "type": "genomic"},
              "xe": {"field": "end", "type": "genomic"},
              "size": {"value": 8},
              "style": {"textFontSize": 8, "dy": 10}
            },
            {
              "dataTransform": [
                {"type": "filter", "field": "type", "oneOf": ["gene"]},
                {"type": "filter", "field": "strand", "oneOf": ["+"]}
              ],
              "mark": "rect",
              "x": {"field": "end", "type": "genomic"},
              "size": {"value": 7}
            },
            {
              "dataTransform": [
                {"type": "filter", "field": "type", "oneOf": ["gene"]},
                {"type": "filter", "field": "strand", "oneOf": ["-"]}
              ],
              "mark": "rect",
              "x": {"field": "start", "type": "genomic"},
              "size": {"value": 7}
            },
            {
              "dataTransform": [
                {"type": "filter", "field": "type", "oneOf": ["exon"]}
              ],
              "mark": "rect",
              "x": {"field": "start", "type": "genomic"},
              "xe": {"field": "end", "type": "genomic"},
              "size": {"value": 14}
            },
            {
              "dataTransform": [
                {"type": "filter", "field": "type", "oneOf": ["gene"]}
              ],
              "mark": "rule",
              "x": {"field": "start", "type": "genomic"},
              "xe": {"field": "end", "type": "genomic"},
              "strokeWidth": {"value": 3}
            }
          ],
          "row": {"field": "strand", "type": "nominal", "domain": ["+", "-"]},
          "color": {
            "field": "strand",
            "type": "nominal",
            "domain": ["+", "-"],
            "range": ["#012DB8", "#BE1E2C"]
          },
          "width": 350,
          "height": 100
        }
      ]
    }
  ]
}