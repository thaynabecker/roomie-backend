from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from roomie.views import RepublicaViewSet, UsuarioViewSet, AdministradorViewSet, DepartamentoViewSet, DespesaViewSet, PagamentoViewSet, TarefaViewSet, AdvertenciaViewSet, ChatMensagemViewSet

from roomie.admin import myadmin

from roomie.auth import LoginUser, RegisterUser

router = DefaultRouter()
router.register(r'republicas', RepublicaViewSet)
router.register(r'usuarios', UsuarioViewSet)
router.register(r'administradores', AdministradorViewSet)
router.register(r'departamentos', DepartamentoViewSet)
router.register(r'despesas', DespesaViewSet)
router.register(r'pagamentos', PagamentoViewSet)
router.register(r'tarefas', TarefaViewSet)
router.register(r'advertencias', AdvertenciaViewSet)
router.register(r'chatmensagens', ChatMensagemViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('admin/', myadmin.urls),
    path("login/", LoginUser, name="login"),
    path("register/", RegisterUser, name="register"),
]