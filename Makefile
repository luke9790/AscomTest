ENV_FILE=.env
ENV_TS=AscomChallenge/src/app/environment.ts
PROJECT_DIR=AscomChallenge

run: install setup setup-env start

setup:
	@if [ ! -f $(ENV_FILE) ]; then \
		echo "Error: $(ENV_FILE) file not found. Please create it or copy from .env.example."; \
		exit 1; \
	fi

install:
	@echo "Installing dependencies..."
	cd $(PROJECT_DIR) && npm install

setup-env:
	@echo "Generating Angular environment file..."
	@export $(shell grep -v '^#' $(ENV_FILE) | xargs) && \
	echo "export const environment = {" > $(ENV_TS) && \
	echo "  production: false," >> $(ENV_TS) && \
	echo "  apiBaseUrl: \"$$API_BASE_URL\"," >> $(ENV_TS) && \
	echo "  apiUser: \"$$API_USER\"," >> $(ENV_TS) && \
	echo "  apiPassword: \"$$API_PASSWORD\"" >> $(ENV_TS) && \
	echo "};" >> $(ENV_TS)

start:
	@echo "Starting Angular project..."
	cd $(PROJECT_DIR) && npx ng serve --open
