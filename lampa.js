(function () {
    'use strict';

    var myServers = [
        { name: 'Google Colab', url: '34.26.198.14:8090' },
        { name: 'Hugging Face', url: 'waite1209-torrrservematrix.hf.space' }
    ];

    function init() {
        try {
            Lampa.Noty.show('Плагин Torr: Запуск...');

            Lampa.Lang.add({
                my_torr_title: { ru: 'Мои серверы Torr', en: 'My Torr Servers' },
                my_torr_descr: { ru: 'Выбор активного адреса сервера', en: 'Select active server address' }
            });

            // Определяем, куда вставлять. Если TorrServer выключен в настройках, 
            // компонент 'torrserver' может отсутствовать. В таком случае пихаем в 'interface'.
            var targetComponent = Lampa.Storage.field('parser_use') ? 'torrserver' : 'interface';

            Lampa.SettingsApi.addParam({
                component: targetComponent,
                param: {
                    name: 'my_torr_list_btn',
                    type: 'button'
                },
                field: {
                    name: Lampa.Lang.translate('my_torr_title'),
                    description: Lampa.Lang.translate('my_torr_descr')
                },
                onChange: function () {
                    renderModal();
                }
            });

            Lampa.Noty.show('Плагин Torr: Готов (раздел ' + targetComponent + ')');
        } catch (e) {
            Lampa.Noty.show('Ошибка плагина: ' + e.message);
        }
    }

    function renderModal() {
        var modalHtml = $('<div class="category-full"></div>');

        myServers.forEach(function (server) {
            var card = $('<div class="navigation-card selector">' +
                '<div class="navigation-card__title">' + server.name + '</div>' +
                '<div class="navigation-card__description">' + server.url + '</div>' +
                '</div>');

            card.on('hover:enter', function () {
                Lampa.Storage.set('torrserver_url', server.url);
                Lampa.Noty.show('Выбран: ' + server.url);
                Lampa.Modal.close();
                
                // Перезагрузка страницы, чтобы настройки применились (опционально)
                // window.location.reload(); 
            });

            modalHtml.append(card);
        });

        Lampa.Modal.open({
            title: 'Список серверов',
            html: modalHtml,
            size: 'medium',
            select: modalHtml.find('.selector').first(),
            onBack: function () {
                Lampa.Modal.close();
                Lampa.Controller.toggle('settings_component');
            }
        });
    }

    // Запуск через проверку готовности
    if (window.appready) init();
    else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') init();
        });
    }
})();
