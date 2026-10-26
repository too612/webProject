package com.main.app.erp.humen.manager;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import javax.imageio.ImageIO;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.server.ResponseStatusException;

class ManagerProfilePhotoStorageTest {

    @TempDir
    Path temp;

    @Test
    void storesOriginalBytesUnderServerGeneratedUuidName() throws IOException {
        var storage = new ManagerProfilePhotoStorage(temp);
        byte[] png = image("png");
        byte[] jpg = image("jpg");

        String pngUrl = storage.store(new MockMultipartFile("file", "../../me.PNG", "image/png", png));
        String jpgUrl = storage.store(new MockMultipartFile("file", "photo.jpeg", "image/jpeg", jpg));

        assertThat(pngUrl).matches("/data/profile/[0-9a-f-]{36}\\.png");
        assertThat(jpgUrl).matches("/data/profile/[0-9a-f-]{36}\\.jpg");
        assertThat(Files.readAllBytes(temp.resolve(pngUrl.substring(14)))).isEqualTo(png);
        assertThat(Files.readAllBytes(temp.resolve(jpgUrl.substring(14)))).isEqualTo(jpg);
        assertThat(storage.store(new MockMultipartFile("file", "me.png", "image/png", png))).isNotEqualTo(pngUrl);
    }

    @Test
    void rejectsInvalidFilesWithoutWriting() throws IOException {
        var storage = new ManagerProfilePhotoStorage(temp);
        byte[] png = image("png");
        assertBadRequest(storage, new MockMultipartFile("file", "a.png", "image/png", new byte[0]));
        assertBadRequest(storage, new MockMultipartFile("file", "a.gif", "image/gif", png));
        assertBadRequest(storage, new MockMultipartFile("file", "a.jpg", "image/jpeg", png));
        assertBadRequest(storage, new MockMultipartFile("file", "a.png", "image/png", "not image".getBytes()));
        byte[] broken = java.util.Arrays.copyOf(png, png.length / 2);
        assertBadRequest(storage, new MockMultipartFile("file", "a.png", "image/png", broken));
        assertThatThrownBy(() -> storage.store(new MockMultipartFile("file", "a.png", "image/png",
                new byte[(int) ManagerProfilePhotoStorage.MAX_SIZE + 1])))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(error -> assertThat(((ResponseStatusException) error).getStatusCode().value()).isEqualTo(413));
        assertThat(Files.exists(temp) ? Files.list(temp).count() : 0).isZero();
    }

    @Test
    void deleteOnlyTouchesFilesInsideProfileRoot() throws IOException {
        var storage = new ManagerProfilePhotoStorage(temp.resolve("profile"));
        String url = storage.store(new MockMultipartFile("file", "a.png", "image/png", image("png")));
        Path outside = Files.writeString(temp.resolve("keep.txt"), "keep");

        storage.deleteQuietly("/data/profile/../keep.txt");
        storage.deleteQuietly(url);

        assertThat(outside).exists();
        assertThat(storage.root().resolve(url.substring(14))).doesNotExist();
    }

    private static void assertBadRequest(ManagerProfilePhotoStorage storage, MockMultipartFile file) {
        assertThatThrownBy(() -> storage.store(file))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(error -> assertThat(((ResponseStatusException) error).getStatusCode().value()).isEqualTo(400));
    }

    private static byte[] image(String format) throws IOException {
        var image = new BufferedImage(30, 40, BufferedImage.TYPE_INT_RGB);
        var output = new ByteArrayOutputStream();
        ImageIO.write(image, format, output);
        return output.toByteArray();
    }
}
