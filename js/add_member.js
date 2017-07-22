$(function(){
	// 请求队长信息
	/*var str='';
	$.ajax({
		url : "http://rapapi.org/mockjsdata/22245/leaderInfo",
		type : "GET",
		success : function(data){
			str =   '<div class="addBox">'+
						'<div class="addBox_title">添加成员<span class="addCancel">×</span></div>'+
						'<div class="addBox_content">'+
						    '<p>'+
						        '队长姓名：<input name="name" type="text" value="'+ data.name +'" readonly="readonly"  /> '+
						    '</p>'+
						    '<p>'+
						        '学号：<input name="schoolId" type="text" value="'+ data.schoolId +'" readonly="readonly"  /> '+
						    '</p>'+
						    '<p>'+
						        '职务：<input name="post" type="text" value="'+ data.post +'" readonly="readonly"  /> '+
						    '</p>'+
						    '<div class="memberInfo">'+
						    '</div>'+
						    '<button class="btn btn_next">添加成员</button>'+
						    '<button class="btn btn_keep">保存添加</button>'+
					    '</div>'+	
				    '</div>';
		},
		error : function(){
			alert("请求失败");
		}
	})*/

	// 点击头像添加成员
	$('.tab_td3').click(function(){
		var str = '';
		str =   '<div class="addBox">'+
					'<div class="addBox_title"><span class="addTitle">添加成员<span><span class="addCancel">×</span></div>'+
					'<div class="addBox_content">'+
					    '<form class="memberInfo_i" method="post" name="formDada">'+
							'<p>'+
							    '队员姓名：<input name="name" type="text" class="name" />'+
					 		'</p>'+
							'<p>'+
							    '学号：<input name="schoolId" type="text"  />'+
							'</p>'+
							'<p>'+
							    '职务：<input name="post" type="text"  />'+
							'</p>'+
							'<button class="btn btn_remove">删除成员</button>'+
						'</form>'+
					    '<div class="memberInfo">'+
					    '</div>'+
					    '<button class="btn btn_next">添加成员</button>'+
					    '<button class="btn btn_keep">保存添加</button>'+
				    '</div>'+	
			    '</div>';
		$('.addMember').html(str);

		// 点击x
		$('.addCancel').click(function(){
			$('.addBox').remove();
		})
		// 点击添加成员，添加form
		$('.btn_next').on('click',function(){
			var addMemberStr = '';
			addMemberStr = '<form class="memberInfo_i" method="post">'+
							    '<p>'+
							        '队员姓名：<input name="name" type="text"  />'+
					 		    '</p>'+
							    '<p>'+
							        '学号：<input name="schoolId" type="text"  />'+
							    '</p>'+
							    '<p>'+
							        '职务：<input name="post" type="text"  />'+
							    '</p>'+
							    '<button class="btn btn_remove">删除成员</button>'+
						    '</form>';
			$('.memberInfo').append(addMemberStr);
			// 点击删除成员
			$('.btn_remove').click(function(){
				if (confirm("确定要删除此成员？")) {
					$(this).parent(".memberInfo_i").remove();
				}
			})
		})

		//点击保存添加 成员信息传给后台数据库
		$(".btn_keep").click(function(){
			var memberMessageList = [];
			var memberLen = $(".memberInfo_i").length;  //计算成员数组长度
			// 将每个成员信息添加到memberMessageList里面
			for(var i=0;i<memberLen;i++){
				var name = $("input[name='name']").eq(i).val();
				var schoolId = $("input[name='schoolId']").eq(i).val();
				var post = $("input[name='post']").eq(i).val();
				var memberMessageItem = {"name":name,"schoolId":schoolId,"post":post};
				memberMessageList.push(memberMessageItem);
			}
			if(confirm("确定添加该组成员？")){
				$.ajax({
					url : "/memberMessageAction!addMemberMessage.action",
					type : "POST",
					data : {
						memberMessageList : memberMessageList
					},
					success : function(data){   //请求成功
						console.log(data);  //打印出后台返回数据
						alert(data.message); 
						window.location.reload();  //页面自动重新加载					
					},
					error : function(){   //请求失败
						alert("请求失败");
					}
				})
			}
		})
	})
})