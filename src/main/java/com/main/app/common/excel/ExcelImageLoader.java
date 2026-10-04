package com.main.app.common.excel;

import com.main.app.common.attachment.AttachmentService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import javax.imageio.ImageIO;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;

@Component
public class ExcelImageLoader {
    private final Path root;
    private final int maxBytes;
    private final AttachmentService attachments;
    public ExcelImageLoader(@Value("${app.upload.path:./data/}") String root,
                            @Value("${app.excel.max-image-bytes:2097152}") int maxBytes,
                            AttachmentService attachments) {
        if (maxBytes <= 0 || maxBytes == Integer.MAX_VALUE) throw new IllegalArgumentException("엑셀 이미지 제한이 올바르지 않습니다.");
        this.root = Path.of(root).toAbsolutePath().normalize();
        this.maxBytes = maxBytes;
        this.attachments = attachments;
    }
    public boolean supportsLocation(String location) {
        return location != null && (location.startsWith("/data/") ||
                location.matches("/api/common/files/[0-9]{1,18}/download"));
    }
    public byte[] read(String location) throws IOException {
        Path path;
        if (location != null && location.matches("/api/common/files/[0-9]{1,18}/download")) {
            var file = attachments.getFile(Long.parseLong(location.split("/")[4]));
            if (file == null || file.getFilePath() == null) throw new ResponseStatusException(HttpStatus.CONFLICT, "프로필 이미지가 없습니다.");
            path = Path.of(file.getFilePath()).toAbsolutePath().normalize();
        } else if (location != null && location.startsWith("/data/")) {
            path = root.resolve(location.substring(6)).normalize();
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "엑셀 프로필은 내부 PNG/JPEG 파일만 지원합니다. 외부 이미지는 허용하지 않습니다.");
        }
        if (!path.startsWith(root) || !path.toRealPath().startsWith(root.toRealPath())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "엑셀 이미지 경로가 올바르지 않습니다.");
        }
        if (Files.size(path) > maxBytes) throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE, "엑셀 이미지 개별 용량 제한을 초과했습니다.");
        byte[] bytes;
        try (var input = Files.newInputStream(path)) { bytes = input.readNBytes(maxBytes + 1); }
        if (bytes.length > maxBytes) throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE, "엑셀 이미지 개별 용량 제한을 초과했습니다.");
        boolean png = bytes.length >= 8 && bytes[0] == (byte) 0x89 && bytes[1] == 'P' && bytes[2] == 'N' && bytes[3] == 'G';
        boolean jpeg = bytes.length >= 3 && bytes[0] == (byte) 0xff && bytes[1] == (byte) 0xd8 && bytes[2] == (byte) 0xff;
        if (!png && !jpeg) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "엑셀 이미지 형식이 올바르지 않습니다.");
        try (var stream = ImageIO.createImageInputStream(new ByteArrayInputStream(bytes))) {
            var readers = ImageIO.getImageReaders(stream);
            if (!readers.hasNext()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "엑셀 이미지가 손상되었습니다.");
            var reader = readers.next();
            try {
                reader.setInput(stream);
                if ((long) reader.getWidth(0) * reader.getHeight(0) > 20_000_000L) {
                    throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE, "엑셀 이미지 해상도 제한을 초과했습니다.");
                }
            } finally { reader.dispose(); }
        }
        return bytes;
    }
    public String fingerprint(String location) {
        try { return hash(read(location)); }
        catch (IOException exception) { throw new ResponseStatusException(HttpStatus.CONFLICT, "프로필 이미지를 확인할 수 없습니다.", exception); }
    }
    public String hash(byte[] bytes) {
        try { return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(bytes)); }
        catch (NoSuchAlgorithmException exception) { throw new IllegalStateException(exception); }
    }
}