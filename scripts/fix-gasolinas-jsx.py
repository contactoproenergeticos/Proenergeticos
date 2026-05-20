from pathlib import Path

p = Path(__file__).resolve().parents[1] / "components" / "GasolinasSlider.tsx"
t = p.read_text(encoding="utf-8")

# Fix mismatched div/motion.div closings
replacements = [
    (
        "Motores turbo e inyección directa\n                  </p>\n                </motion.div>",
        "Motores turbo e inyección directa\n                  </p>\n                </motion.div>".replace(
            "</motion.div>", "</div>"
        ),
    ),
    (
        "Rendimiento diario optimizado\n                  </p>\n                </motion.div>\n              </motion.div>",
        "Rendimiento diario optimizado\n                  </p>\n                </motion.div>\n              </motion.div>".replace(
            "</motion.div>", "</div>", 1
        ).replace("</motion.div>", "</div>", 1),
    ),
    ("            </button>\n          </motion.div>\n\n          {slide.logo", "            </button>\n          </motion.div>\n\n          {slide.logo".replace(
        "</motion.div>", "</motion.div>", 1
    )),
]

# Simpler: replace all erroneous patterns
t = t.replace(
    "                  </p>\n                </motion.div>\n                <div className=\"bg-white/5 border-l-4 border-[#00843D]",
    "                  </p>\n                </motion.div>\n                <div className=\"bg-white/5 border-l-4 border-[#00843D]".replace(
        "</motion.div>", "</div>"
    ),
)
t = t.replace(
    "Rendimiento diario optimizado\n                  </p>\n                </motion.div>\n              </motion.div>",
    "Rendimiento diario optimizado\n                  </p>\n                </motion.div>\n              </motion.div>".replace(
        "</motion.div>", "</motion.div>"
    ),
)

# Direct line fixes
t = t.replace("                </motion.div>\n                <div className=\"bg-white/5 border-l-4 border-[#00843D]", "                </motion.div>\n                <div className=\"bg-white/5 border-l-4 border-[#00843D]")
# The above is noop - let me do it right

lines = t.splitlines()
for i, line in enumerate(lines):
    if line.strip() == "</motion.div>":
        # context-based fixes by line number (0-indexed)
        pass

# Brute force known bad closings at specific content
t = t.replace(
    """                </motion.div>
                <motion.div className="bg-white/5 border-l-4 border-[#00843D]""",
    """                </motion.div>
                <motion.div className="bg-white/5 border-l-4 border-[#00843D]""",
)

p.write_text(t, encoding="utf-8")
print("done")
