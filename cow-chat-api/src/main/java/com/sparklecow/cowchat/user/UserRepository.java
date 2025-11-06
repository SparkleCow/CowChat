package com.sparklecow.cowchat.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    Optional<User> findByUsername(String username);

    @Query(name = "User.findAllExcept")
    List<User> findAllExcept(@Param("userId") String userId);

    List<User> findByUsernameContainingIgnoreCase(String username);
}
