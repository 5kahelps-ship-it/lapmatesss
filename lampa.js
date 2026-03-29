(function () {
    'use strict';

    // Твой список серверов
    var myServers = [
        { name: 'Google Colab', url: '34.26.198.14:8090' },
        { name: 'Hugging Face', url: 'waite1209-torrrservematrix.hf.space' }
    ];

    function startPlugin() {
        // 1. Добавляем переводы, чтобы кнопка не была пустой
        Lampa.Lang.add({
            my_torr_title: { ru: 'Мои серверы', en: 'My Servers' },
            my_torr_descr: { ru: 'Выбрать быстрый адрес TorrServer', en: 'Select TorrServer address' }
        });

        // 2. Добавляем кнопку в раздел "TorrServer"
        Lampa.SettingsApi.addParam({
            component: 'torrserver', // В какой раздел настроек пихаем
            param: {
                name: 'my_custom_torr_button',
                type: 'button'
            },
            field: {
                name: Lampa.Lang.translate('my_torr_title'),
                description: Lampa.Lang.translate('my_torr_descr')
            },
            onChange: function () {
                openTorrList();
            }
        });
    }

    function openTorrList() {
        var html = $('<div class="category-full"></div>');
        
        myServers.forEach(function (server) {
            var item = $('<div class="navigation-card selector"><div class="navigation-card__title">' + server.name + '</div><div class="navigation-card__description">' + server.url + '</div></div>');
            
            item.on('hover:enter', function () {
                // Прямая запись в память Лампы через API
                Lampa.Storage.set('torrserver_url', server.url);
                Lampa.Noty.show('Адрес изменен на: ' + server.url);
                Lampa.Modal.close();
            });
            
            html.append(item);
        });

        Lampa.Modal.open({
            title: 'Выберите сервер',
            html: html,
            size: 'medium',
            select: html.find('.selector').first(),
            onBack: function() {
                Lampa.Modal.close();
                Lampa.Controller.toggle('settings_component'); // Возврат в настройки
            }
        });
    }

    // Ждем готовности Lampa
    if (window.appready) startPlugin();
    else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') startPlugin();
        });
    }
})();
