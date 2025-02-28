package com.tecProject.tec.auth;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;

public class RequestThrottleFilter implements Filter {
	
	private static final int MAX_REQUESTS = 10;
	private static final long TIME_WINDOW_MS = 60 * 1000;
	private final ConcurrentHashMap<String, AtomicInteger> requestCounts = new ConcurrentHashMap<>();
	private final ConcurrentHashMap<String, Long> requestTimestamps = new ConcurrentHashMap<>();
	
	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException {
		HttpServletRequest req = (HttpServletRequest) request;
		String ip = req.getRemoteAddr();
		
		long now = System.currentTimeMillis();
		
		requestCounts.putIfAbsent(ip, new AtomicInteger(0));
		requestTimestamps.putIfAbsent(ip, now);
		
		if (now - requestTimestamps.get(ip) > TIME_WINDOW_MS) {
			requestCounts.get(ip).set(0);
			requestTimestamps.put(ip,  now);
		}
		
		if (requestCounts.get(ip).incrementAndGet() > MAX_REQUESTS) {
			response.getWriter().write("Too many request. Try again later.");
			((jakarta.servlet.http.HttpServletResponse) response).setStatus(429);
			return;
		}
		chain.doFilter(request, response);
		
	}
	
	
	
}
