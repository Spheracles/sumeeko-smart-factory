package tw.sumeeko.learning.factory;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.WindowInsets;
import android.window.OnBackInvokedCallback;
import android.window.OnBackInvokedDispatcher;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;

import androidx.annotation.NonNull;
import androidx.webkit.WebViewAssetLoader;

/**
 * SUMEEKO 智慧工廠：以 WebView 載入 App 內建的離線網頁資源（assets/www）。
 * - 使用 WebViewAssetLoader 以 https://appassets.androidplatform.net 提供同源存取（localStorage、iframe 生存戰）。
 * - Android 返回鍵交給網頁端返回堆疊（window.__handleBack），未處理時才結束 App。
 * - 進入背景時通知網頁暫停動畫與音效（window.__appPause / __appResume）。
 * - 不連接任何真實設備，不需要危險權限。
 */
public class MainActivity extends Activity {

    private static final String HOST = "appassets.androidplatform.net";
    private static final String START_URL = "https://" + HOST + "/assets/www/index.html";
    private static final String FALLBACK_URL = "file:///android_asset/www/index.html";

    private WebView webView;
    private boolean triedFallback = false;
    private boolean webReady = false;
    private Object systemBackCallback;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(Color.parseColor("#101D2B"));
        webView = new WebView(this);
        webView.setBackgroundColor(Color.parseColor("#101D2B"));
        root.addView(webView, new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT));
        setContentView(root);

        // Android 13+ 使用系統返回回呼，讓手勢返回與實體返回鍵走同一網頁堆疊。
        // Android 8–12 則保留 onBackPressed()。
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            systemBackCallback = Api33BackBridge.register(this, this::handleBackNavigation);
        }

        // Android 15（API 35）起 targetSdk 35 強制 edge-to-edge，需自行避開系統列；較舊版本由系統處理
        root.setOnApplyWindowInsetsListener((v, insets) -> {
            if (Build.VERSION.SDK_INT < 35) {
                v.setPadding(0, 0, 0, 0);
                return insets;
            }
            int l, t, r, b;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                android.graphics.Insets in = insets.getInsets(WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout() | WindowInsets.Type.ime());
                l = in.left; t = in.top; r = in.right; b = in.bottom;
            } else {
                l = insets.getSystemWindowInsetLeft(); t = insets.getSystemWindowInsetTop();
                r = insets.getSystemWindowInsetRight(); b = insets.getSystemWindowInsetBottom();
            }
            v.setPadding(l, t, r, b);
            return insets;
        });

        WebSettings s = webView.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);          // localStorage：學習進度、設定、職涯存檔
        s.setDatabaseEnabled(true);
        s.setMediaPlaybackRequiresUserGesture(true);
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(false);
        s.setSupportMultipleWindows(false);
        s.setTextZoom(100);
        s.setCacheMode(WebSettings.LOAD_DEFAULT);

        if (BuildConfig.DEBUG) {
            WebView.setWebContentsDebuggingEnabled(true); // 僅 Debug 版可用 chrome://inspect 除錯
        }

        final WebViewAssetLoader assetLoader = new WebViewAssetLoader.Builder()
                .setDomain(HOST)
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
                .build();

        webView.setWebChromeClient(new WebChromeClient());
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageStarted(WebView view, String url, android.graphics.Bitmap favicon) {
                webReady = false;
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                webReady = true;
            }

            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return assetLoader.shouldInterceptRequest(request.getUrl());
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                String scheme = uri.getScheme();
                if ("file".equals(scheme) || HOST.equals(uri.getHost())) {
                    return false; // App 內部頁面
                }
                // 外部連結（例如公開專利原文）交給系統瀏覽器
                try {
                    startActivity(new Intent(Intent.ACTION_VIEW, uri));
                } catch (ActivityNotFoundException ignored) {
                }
                return true;
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                // 若某些 WebView 版本無法透過 AssetLoader 載入主頁，改用 android_asset 備援路徑
                if (request.isForMainFrame() && !triedFallback) {
                    triedFallback = true;
                    view.loadUrl(FALLBACK_URL);
                }
            }
        });

        webView.addJavascriptInterface(new AppBridge(), "AndroidApp");

        if (savedInstanceState != null) {
            webView.restoreState(savedInstanceState);
        } else {
            webView.loadUrl(START_URL);
        }
    }

    /** 提供網頁端查詢 App 版本與結束 App */
    public class AppBridge {
        @JavascriptInterface
        public String version() {
            return BuildConfig.VERSION_NAME;
        }

        @JavascriptInterface
        public void exitApp() {
            runOnUiThread(MainActivity.this::finish);
        }
    }

    /** 只在 API 33+ 載入此類別，避免 Android 8–12 載入不存在的系統類型。 */
    private static final class Api33BackBridge {
        static Object register(MainActivity activity, Runnable handler) {
            OnBackInvokedCallback callback = handler::run;
            activity.getOnBackInvokedDispatcher().registerOnBackInvokedCallback(
                    OnBackInvokedDispatcher.PRIORITY_DEFAULT, callback);
            return callback;
        }
        static void unregister(MainActivity activity, Object callback) {
            activity.getOnBackInvokedDispatcher().unregisterOnBackInvokedCallback(
                    (OnBackInvokedCallback) callback);
        }
    }

    /** Android 原生返回／手勢返回：網頁內層優先，首頁再結束 Activity。 */
    private void handleBackNavigation() {
        if (webView == null || isFinishing()) return;
        // A back gesture during cold start should not terminate the app before JS mounts.
        if (!webReady) return;
        webView.evaluateJavascript(
                "(function(){try{return !!(window.__handleBack&&window.__handleBack());}catch(e){return false;}})()",
                value -> {
                    if (!"true".equals(value) && !isFinishing()) finish();
                });
    }

    @SuppressWarnings("deprecation")
    @Override
    public void onBackPressed() {
        // Android 8–12 及系統可能送來的傳統返回事件。
        handleBackNavigation();
    }

    @Override
    protected void onPause() {
        if (webView != null) {
            webView.evaluateJavascript("window.__appPause&&window.__appPause()", null);
            webView.onPause();
        }
        super.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (webView != null) {
            webView.onResume();
            webView.evaluateJavascript("window.__appResume&&window.__appResume()", null);
        }
    }

    @Override
    protected void onSaveInstanceState(@NonNull Bundle outState) {
        super.onSaveInstanceState(outState);
        if (webView != null) webView.saveState(outState);
    }

    @Override
    protected void onDestroy() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU && systemBackCallback != null) {
            Api33BackBridge.unregister(this, systemBackCallback);
            systemBackCallback = null;
        }
        if (webView != null) {
            webView.removeJavascriptInterface("AndroidApp");
            webView.destroy();
            webView = null;
        }
        super.onDestroy();
    }
}
