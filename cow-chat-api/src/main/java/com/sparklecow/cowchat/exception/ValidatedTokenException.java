package com.sparklecow.cowchat.exception;

public class ValidatedTokenException extends RuntimeException {
    public ValidatedTokenException(String message) {
        super(message);
    }
}
