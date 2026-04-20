package com.gestion_academique.backend.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue) {
        super(String.format("%s non trouvé(e) avec %s : '%s'", resourceName, fieldName, fieldValue));
    }
}
