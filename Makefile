
DOCKER_ACCOUNT=<DOCKER ACCOUNT>

build-dbimage:
	docker build --pull --rm -f db.Dockerfile -t $(DOCKER_ACCOUNT)/kymahdi:latest .

build-capimage: ## Build the container without caching
	docker build --pull --rm -f Dockerfile -t $(DOCKER_ACCOUNT)/kymacaps4ems:latest .

build-uiimage:
	docker build --pull --rm -f app/businesspartners/Dockerfile -t $(DOCKER_ACCOUNT)/kymacaps4ui:latest ./app/businesspartners

push-images: build-dbimage build-capimage build-uiimage
	docker push $(DOCKER_ACCOUNT)/kymahdi:latest
	docker push $(DOCKER_ACCOUNT)/kymacaps4ems:latest
	docker push $(DOCKER_ACCOUNT)/kymacaps4ui:latest
