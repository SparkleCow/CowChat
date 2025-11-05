package com.sparklecow.cowchat.user;

import com.sparklecow.cowchat.common.file.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@CrossOrigin("*")
public class UserController {

    private final UserService userService;
    private final FileService fileService;

    @GetMapping()
    public ResponseEntity<List<UserResponseDto>> findAllUsersExceptSelf(Authentication authentication){
        return ResponseEntity.ok(userService.findAllUsersExceptSelf(authentication));
    }

    @GetMapping("/self")
    public ResponseEntity<UserResponseDto> findLoggedUsed(Authentication authentication){
        return ResponseEntity.ok(userService.findUserLogged(authentication));
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam String key,
                                             @RequestPart MultipartFile file,
                                             Authentication authentication) throws IOException {
        String imagePath = fileService.uploadProfileImageToS3(file, key, (User) authentication.getPrincipal());
        return ResponseEntity.ok(userService.updateProfileImage(authentication, imagePath));
    }

    @PutMapping("/update")
    public ResponseEntity<AuthResponseDto> updateUsername(@RequestBody UserUpdateDto userUpdateDto,
                                                      Authentication authentication){

        return ResponseEntity.ok(userService.updateUsername(authentication, userUpdateDto));
    }
}
