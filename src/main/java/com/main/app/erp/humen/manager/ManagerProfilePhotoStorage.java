package com.main.app.erp.humen.manager;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.Iterator;
import java.util.Locale;
import java.util.UUID;

import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import javax.imageio.stream.ImageInputStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import lombok.extern.slf4j.Slf4j;

/**
 * 성도 프로필 사진을 data/profile/&lt;UUID&gt;.(jpg|png) 로 저장한다.
 * 원본 바이트를 그대로 저장하며 재인코딩하지 않는다.
 */
@Slf4j
@Component
public class ManagerProfilePhotoStorage {

    public static final long MAX_SIZE = 5L * 1024 * 1024;
    private static final long MAX_PIXELS = 20_000_000L;
    static final String URL_PREFIX = "/data/profile/";

    private final Path root;

    @Autowired
    public ManagerProfilePhotoStorage(@Value("${app.upload.path:./data/}") String uploadRoot) {
        this(Path.of(uploadRoot, "profile"));
    }

    ManagerProfilePhotoStorage(Path root) {
        this.root = root.toAbsolutePath().normalize();
    }

    /** 검증 후 저장하고 공개 URL(/data/profile/...)을 반환한다. */
    public String store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "업로드할 사진을 선택하세요.");
        }
        if (file.getSize() > MAX_SIZE) {
            throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE, "사진은 5MB 이하만 업로드할 수 있습니다.");
        }
        String extension = extensionOf(file.getOriginalFilename());
        byte[] bytes;
        try {
            bytes = file.getBytes();
        } catch (IOException exception) {
            throw new UncheckedIOException("프로필 사진을 읽지 못했습니다.", exception);
        }
        if (bytes.length == 0 || bytes.length > MAX_SIZE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "사진은 5MB 이하만 업로드할 수 있습니다.");
        }
        String format = detectFormat(bytes);
        if (!format.equals(extension)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "파일 확장자와 실제 이미지 형식이 일치하지 않습니다.");
        }

        Path target = root.resolve(UUID.randomUUID() + "." + extension).normalize();
        if (!target.getParent().equals(root)) {
            throw new IllegalStateException("잘못된 프로필 사진 저장 경로입니다.");
        }
        try {
            Files.createDirectories(root);
            Files.write(target, bytes, StandardOpenOption.CREATE_NEW, StandardOpenOption.WRITE);
        } catch (IOException exception) {
            throw new UncheckedIOException("프로필 사진을 저장하지 못했습니다.", exception);
        }
        return URL_PREFIX + target.getFileName();
    }

    /** 이번 요청에서 저장한 파일을 정리한다. 실패해도 예외를 던지지 않고 기록만 남긴다. */
    public void deleteQuietly(String url) {
        if (url == null || !url.startsWith(URL_PREFIX)) {
            return;
        }
        Path target = root.resolve(url.substring(URL_PREFIX.length())).normalize();
        if (!target.getParent().equals(root)) {
            return;
        }
        try {
            Files.deleteIfExists(target);
        } catch (IOException exception) {
            log.warn("프로필 사진 정리 실패: {}", target, exception);
        }
    }

    Path root() {
        return root;
    }

    private static String extensionOf(String filename) {
        String name = filename == null ? "" : filename.trim().toLowerCase(Locale.ROOT);
        int dot = name.lastIndexOf('.');
        String extension = dot < 0 ? "" : name.substring(dot + 1);
        return switch (extension) {
            case "jpg", "jpeg" -> "jpg";
            case "png" -> "png";
            default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "JPG 또는 PNG 사진만 업로드할 수 있습니다.");
        };
    }

    private static String detectFormat(byte[] bytes) {
        try (InputStream input = new ByteArrayInputStream(bytes);
                ImageInputStream imageInput = ImageIO.createImageInputStream(input)) {
            Iterator<ImageReader> readers = imageInput == null ? null : ImageIO.getImageReaders(imageInput);
            if (readers == null || !readers.hasNext()) {
                throw invalidImage();
            }
            ImageReader reader = readers.next();
            try {
                reader.setInput(imageInput, true, true);
                String format = reader.getFormatName().toLowerCase(Locale.ROOT);
                long pixels = (long) reader.getWidth(0) * reader.getHeight(0);
                if (pixels <= 0) {
                    throw invalidImage();
                }
                if (pixels > MAX_PIXELS) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "사진 해상도가 너무 큽니다.");
                }
                if (reader.read(0) == null) {
                    throw invalidImage();
                }
                return switch (format) {
                    case "jpeg", "jpg" -> "jpg";
                    case "png" -> "png";
                    default -> throw invalidImage();
                };
            } finally {
                reader.dispose();
            }
        } catch (IOException | RuntimeException exception) {
            if (exception instanceof ResponseStatusException status) {
                throw status;
            }
            throw invalidImage();
        }
    }

    private static ResponseStatusException invalidImage() {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, "올바른 JPG 또는 PNG 이미지가 아닙니다.");
    }
}
