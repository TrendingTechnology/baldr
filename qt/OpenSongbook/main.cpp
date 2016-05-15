#include <QtWebEngineWidgets>

int main(int argc, char **argv)
{
	QApplication app (argc, argv);
	QUrl url = (argc > 1) ? QUrl::fromUserInput(argv[1]) : QUrl("https://cheat.friedrich.rocks");

	QWebEngineView view;
	view.load(url);
	view.setWindowState(view.windowState() ^ Qt::WindowFullScreen);
	view.show();

	return app.exec();
}
