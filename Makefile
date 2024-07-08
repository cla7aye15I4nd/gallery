# Variables
JS_FILES=$(wildcard js/*.js)
CSS_FILES=$(wildcard css/*.css)
HTML_FILES=$(wildcard html/*.html)
MIN_JS_FILES=$(wildcard js/*.min.js)
MIN_CSS_FILES=$(wildcard css/*.min.css)
DATA_JSON=json/data.json
PY_SCRIPT=generate_image_sizes.py

# Filter out minified files
NON_MIN_JS_FILES=$(filter-out $(MIN_JS_FILES),$(JS_FILES))
NON_MIN_CSS_FILES=$(filter-out $(MIN_CSS_FILES),$(CSS_FILES))

# Targets
all: compress_json minify_js minify_html minify_css

compress_json: $(DATA_JSON) $(PY_SCRIPT)
	@echo "Generating image sizes and compressing JSON..."
	@python $(PY_SCRIPT)
	@echo "JSON compression completed."

minify_js: $(NON_MIN_JS_FILES)
	@echo "Minifying JavaScript files..."
	@for file in $(NON_MIN_JS_FILES); do \
		uglifyjs $$file -o $$(dirname $$file)/$$(basename $$file .js).min.js; \
	done
	@echo "JavaScript minification completed."

minify_css: $(NON_MIN_CSS_FILES)
	@echo "Minifying CSS files..."
	@for file in $(NON_MIN_CSS_FILES); do \
		uglifycss $$file > $$(dirname $$file)/$$(basename $$file .css).min.css; \
	done
	@echo "CSS minification completed."

minify_html: $(HTML_FILES)
	@echo "Minifying HTML files..."
	@for file in $(HTML_FILES); do \
		npx html-minifier --collapse-whitespace --remove-comments $$file -o $$(basename $$file .html).html; \
	done
	@echo "HTML minification completed."

clean:
	@echo "Cleaning up minified and compressed files..."
	@rm -f js/*.min.js css/*.min.css *.min.html $(DATA_JSON_GZ)
	@echo "Cleanup completed."

.PHONY: all compress_json minify_js minify_css minify_html clean
