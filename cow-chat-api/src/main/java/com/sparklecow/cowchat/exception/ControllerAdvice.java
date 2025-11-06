package com.sparklecow.cowchat.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.io.IOException;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import static com.sparklecow.cowchat.exception.BusinessErrorCodes.*;

@RestControllerAdvice
public class ControllerAdvice {

    @ExceptionHandler(IOException.class)
    public ResponseEntity<ExceptionResponse> inputOutputExceptionHandler(IOException ex){
        return ResponseEntity.status(IO_EXCEPTION.getHttpStatus())
                .body(ExceptionResponse.builder()
                        .businessErrorCode(IO_EXCEPTION.getErrorCode())
                        .businessErrorDescription(IO_EXCEPTION.getMessage() + " " +ex.getMessage())
                        .message(ex.getMessage())
                        .build());
    }

    /*This will handle validation errors.*/
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ExceptionResponse> handleValidationException(MethodArgumentNotValidException ex) {
        Set<String> validationErrors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.toSet());

        ExceptionResponse response = ExceptionResponse.builder()
                .message("Error validating sent data")
                .businessErrorCode(VALIDATION_ERROR.getErrorCode())
                .businessErrorDescription(VALIDATION_ERROR.getMessage())
                .validationErrors(validationErrors)
                .build();

        return ResponseEntity
                .status(VALIDATION_ERROR.getHttpStatus())
                .body(response);
    }

    @ExceptionHandler(FileCompressionException.class)
    public ResponseEntity<ExceptionResponse> handleFileCompressionException(FileCompressionException ex) {
        Map<String, String> errorDetails = Map.of(
                "cause", ex.getCause() != null ? ex.getCause().getMessage() : "No specific cause",
                "exceptionType", ex.getClass().getSimpleName()
        );

        return ResponseEntity
                .status(BusinessErrorCodes.MESSAGE_ERROR.getHttpStatus())
                .body(ExceptionResponse.builder()
                        .message(ex.getMessage())
                        .businessErrorCode(BusinessErrorCodes.MESSAGE_ERROR.getErrorCode())
                        .businessErrorDescription(BusinessErrorCodes.MESSAGE_ERROR.getMessage())
                        .errorDetails(errorDetails)
                        .build());
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ExceptionResponse> handleUserNotFoundException(UserNotFoundException ex) {
        return ResponseEntity.status(BusinessErrorCodes.USER_NOT_FOUND.getHttpStatus())
                .body(ExceptionResponse.builder()
                        .businessErrorCode(BusinessErrorCodes.USER_NOT_FOUND.getErrorCode())
                        .businessErrorDescription(BusinessErrorCodes.USER_NOT_FOUND.getMessage())
                        .message(ex.getMessage())
                        .build());
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ExceptionResponse> handleUsernameNotFoundException(UsernameNotFoundException ex) {
        return ResponseEntity.status(BusinessErrorCodes.USER_NOT_FOUND.getHttpStatus())
                .body(ExceptionResponse.builder()
                        .businessErrorCode(BusinessErrorCodes.USER_NOT_FOUND.getErrorCode())
                        .businessErrorDescription(BusinessErrorCodes.USER_NOT_FOUND.getMessage())
                        .message(ex.getMessage())
                        .build());
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ExceptionResponse> handleAuthExceptions(BadCredentialsException ex) {
        return ResponseEntity.status(BAD_CREDENTIALS.getHttpStatus())
                .body(ExceptionResponse.builder()
                        .message(ex.getMessage())
                        .businessErrorCode(BAD_CREDENTIALS.getErrorCode())
                        .businessErrorDescription(BAD_CREDENTIALS.getMessage())
                        .build());
    }

    @ExceptionHandler(ChatNotFoundException.class)
    public ResponseEntity<ExceptionResponse> handleAuthExceptions(ChatNotFoundException ex) {
        return ResponseEntity.status(CHAT_NOT_FOUND.getHttpStatus())
                .body(ExceptionResponse.builder()
                        .message(ex.getMessage())
                        .businessErrorCode(CHAT_NOT_FOUND.getErrorCode())
                        .businessErrorDescription(CHAT_NOT_FOUND.getMessage())
                        .build());
    }
}
