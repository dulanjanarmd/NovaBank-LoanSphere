package com.novabank.loansphere.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtHelper {

    @Value(" \)
 private String secret;

 @Value(\\)
 private Long expiration;

 // Retrieve username from JWT token
 public String getUsernameFromToken(String token) {
 return getClaimFromToken(token, Claims::getSubject);
 }

 // Retrieve expiration date from JWT token
 public Date getExpirationDateFromToken(String token) {
 return getClaimFromToken(token, Claims::getExpiration);
 }

 public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
 final Claims claims = getAllClaimsFromToken(token);
 return claimsResolver.apply(claims);
 }

 // For retrieving any information from token we will need the secret key
 private Claims getAllClaimsFromToken(String token) {
 return Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody();
 }

 // Check if the token has expired
 private Boolean isTokenExpired(String token) {
 final Date expiration = getExpirationDateFromToken(token);
 return expiration.before(new Date());
 }

 // Generate token for user
 public String generateToken(String username, String role) {
 Map<String, Object> claims = new HashMap<>();
 claims.put(\role\, role);
 return createToken(claims, username);
 }

 // Create the actual JWT token
 private String createToken(Map<String, Object> claims, String subject) {
 return Jwts.builder()
 .setClaims(claims)
 .setSubject(subject)
 .setIssuedAt(new Date(System.currentTimeMillis()))
 .setExpiration(new Date(System.currentTimeMillis() + expiration))
 .signWith(SignatureAlgorithm.HS512, secret)
 .compact();
 }

 // Validate token
 public Boolean validateToken(String token) {
 try {
 final String username = getUsernameFromToken(token);
 final Date expiration = getExpirationDateFromToken(token);
 return username != null && !isTokenExpired(token);
 } catch (Exception e) {
 return false;
 }
 }
}
