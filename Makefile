.PHONY: core api web up clean

core:
	$(MAKE) -C core run

api:
	$(MAKE) -C api run

web:
	cd web && npm run dev

up:
	docker compose up --build

clean:
	$(MAKE) -C core clean
	$(MAKE) -C api clean
	docker compose down -v